package ai_service

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/tsigemariamzewdu/JobMate-backend/delivery/dto"
	"github.com/tsigemariamzewdu/JobMate-backend/domain/interfaces/repositories"
	services "github.com/tsigemariamzewdu/JobMate-backend/domain/interfaces/services"
	"github.com/tsigemariamzewdu/JobMate-backend/domain/models"
	"github.com/tsigemariamzewdu/JobMate-backend/infrastructure/job_service"
	"github.com/tsigemariamzewdu/JobMate-backend/repositories"
)

type JobAIService struct {
	AIService   services.IAIService
	JobService  *job_service.JobService
	UserRepo    interfaces.IUserRepository
	JobChatRepo *repositories.JobChatRepository
}

func NewJobAIService(aiService services.IAIService, jobService *job_service.JobService, userRepo interfaces.IUserRepository, jobChatRepo *repositories.JobChatRepository) *JobAIService {
	return &JobAIService{
		AIService:   aiService,
		JobService:  jobService,
		UserRepo:    userRepo,
		JobChatRepo: jobChatRepo,
	}
}

func (s *JobAIService) HandleJobConversation(ctx context.Context, userID string, userMessage string, chatID string) (*models.JobAIResponse, error) {
	// Get chat history
	var chatHistory []models.JobChatMessage
	if chatID != "" {
		chat, err := s.JobChatRepo.GetJobChatByID(ctx, chatID)
		if err == nil && chat != nil {
			chatHistory = chat.Messages
		}
	}

	// Get user profile for context
	var userProfile *models.User
	if userID != "" {
		userProfile, _ = s.UserRepo.GetByID(ctx, userID)
	}

	// Prepare AI messages with system prompt
	messages := s.prepareAIMessages(userMessage, chatHistory, userProfile)

	// Call AI
	aiResponse, err := s.AIService.GetChatCompletion(ctx, messages, nil)
	if err != nil {
		log.Printf("AI call failed: %v", err)
		searchCriteria := s.extractFallbackCriteria(userMessage, userProfile)
		return s.respondWithJobSearch(ctx, userID, chatID, userMessage, searchCriteria, "I could not reach Gemini, so I used a local career matching fallback for now."), nil
	}

	// Extract job search criteria from AI response
	searchCriteria, aiTextResponse := s.extractJobSearchCriteriaAndResponse(aiResponse.Content, userProfile)
	if searchCriteria == nil {
		searchCriteria = s.extractFallbackCriteria(userMessage, userProfile)
	}
	return s.respondWithJobSearch(ctx, userID, chatID, userMessage, searchCriteria, aiTextResponse), nil
}

func (s *JobAIService) respondWithJobSearch(ctx context.Context, userID string, chatID string, userMessage string, searchCriteria *dto.JobSearchCriteriaDTO, aiTextResponse string) *models.JobAIResponse {
	// If criteria is found and complete, perform job search
	var jobs []models.Job
	var searchMsg string
	var err error

	if searchCriteria != nil && s.isCriteriaComplete(searchCriteria) {
		jobs, searchMsg, err = s.JobService.GetCuratedJobs(
			searchCriteria.Field,
			searchCriteria.LookingFor,
			searchCriteria.Experience,
			searchCriteria.Skills,
			searchCriteria.Language,
		)

		if err != nil {
			log.Printf("Job search failed: %v", err)
			searchMsg = "I couldn't find any current job openings matching your criteria. Please try different search terms or check back later."
		}
	}

	// Combine AI response with job search results
	finalResponse := s.formatFinalResponse(aiTextResponse, searchMsg, jobs, searchCriteria)

	// Save to chat history
	response := s.saveChatHistory(ctx, userID, chatID, userMessage, finalResponse, searchCriteria, jobs)
	response.Jobs = jobs

	return response
}

func (s *JobAIService) extractJobSearchCriteriaAndResponse(aiResponse string, userProfile *models.User) (*dto.JobSearchCriteriaDTO, string) {
	var criteria *dto.JobSearchCriteriaDTO
	textResponse := aiResponse

	jsonStr := extractJSONObject(aiResponse)
	if jsonStr != "" {
		// Extract JSON and remove it from the text response
		textResponse = strings.Replace(aiResponse, jsonStr, "", 1)
		textResponse = strings.TrimSpace(textResponse)

		var criteriaData dto.JobSearchCriteriaDTO
		err := json.Unmarshal([]byte(jsonStr), &criteriaData)
		if err != nil {
			log.Printf("Failed to parse job search criteria: %v", err)
		} else {
			criteria = &criteriaData

			// Enhance with user profile data if available
			if userProfile != nil {
				if len(criteria.Skills) == 0 && len(userProfile.Skills) > 0 {
					criteria.Skills = userProfile.Skills
				}

				if criteria.Experience == "" && userProfile.YearsExperience != nil && *userProfile.YearsExperience > 0 {
					if *userProfile.YearsExperience < 3 {
						criteria.Experience = "entry-level"
					} else if *userProfile.YearsExperience < 7 {
						criteria.Experience = "mid-level"
					} else {
						criteria.Experience = "senior"
					}
				}
			}
		}
	}

	return criteria, textResponse
}

func extractJSONObject(value string) string {
	start := strings.Index(value, "{")
	end := strings.LastIndex(value, "}")
	if start == -1 || end == -1 || end <= start {
		return ""
	}
	return strings.TrimSpace(value[start : end+1])
}

func (s *JobAIService) extractFallbackCriteria(userMessage string, userProfile *models.User) *dto.JobSearchCriteriaDTO {
	lower := strings.ToLower(userMessage)
	criteria := &dto.JobSearchCriteriaDTO{
		Language:   "en",
		LookingFor: "remote",
		Experience: "entry-level",
		Skills:     []string{},
	}

	if strings.Contains(lower, "amharic") || strings.Contains(lower, "አማርኛ") {
		criteria.Language = "am"
	}
	if strings.Contains(lower, "local") || strings.Contains(lower, "ethiopia") || strings.Contains(lower, "addis") {
		criteria.LookingFor = "local"
	}
	if strings.Contains(lower, "freelance") || strings.Contains(lower, "contract") {
		criteria.LookingFor = "freelance"
	}
	if strings.Contains(lower, "senior") || strings.Contains(lower, "lead") {
		criteria.Experience = "senior"
	} else if strings.Contains(lower, "mid") || strings.Contains(lower, "3 years") || strings.Contains(lower, "4 years") || strings.Contains(lower, "5 years") {
		criteria.Experience = "mid-level"
	}

	knownFields := []string{"software", "frontend", "backend", "data", "marketing", "sales", "design", "finance", "accounting", "project management", "product"}
	for _, field := range knownFields {
		if strings.Contains(lower, field) {
			criteria.Field = field
			break
		}
	}
	if criteria.Field == "" && userProfile != nil && userProfile.CareerInterests != nil {
		criteria.Field = *userProfile.CareerInterests
	}
	if criteria.Field == "" {
		criteria.Field = strings.TrimSpace(userMessage)
	}

	knownSkills := []string{"react", "next.js", "typescript", "javascript", "python", "sql", "mongodb", "go", "figma", "excel", "communication"}
	for _, skill := range knownSkills {
		if strings.Contains(lower, skill) {
			criteria.Skills = append(criteria.Skills, skill)
		}
	}
	if len(criteria.Skills) == 0 && userProfile != nil && len(userProfile.Skills) > 0 {
		criteria.Skills = userProfile.Skills
	}

	return criteria
}

func (s *JobAIService) isCriteriaComplete(criteria *dto.JobSearchCriteriaDTO) bool {
	return criteria.Field != "" && criteria.LookingFor != ""
}

func (s *JobAIService) formatFinalResponse(aiTextResponse, searchMsg string, jobs []models.Job, criteria *dto.JobSearchCriteriaDTO) string {
	if aiTextResponse == "" && criteria != nil {
		// If AI only returned JSON, create a friendly response
		aiTextResponse = fmt.Sprintf("I found your job preferences: %s %s position", criteria.Experience, criteria.Field)
		if len(criteria.Skills) > 0 {
			aiTextResponse += fmt.Sprintf(" with skills in %s", strings.Join(criteria.Skills, ", "))
		}
	}

	finalResponse := aiTextResponse

	if searchMsg != "" {
		if finalResponse != "" {
			finalResponse += "\n\n" + searchMsg
		} else {
			finalResponse = searchMsg
		}
	}

	if len(jobs) == 0 && criteria != nil && s.isCriteriaComplete(criteria) {
		finalResponse += "\n\nNo current job openings were found. You might want to:"
		finalResponse += "\n• Try different search terms"
		finalResponse += "\n• Broaden your location preference"
		finalResponse += "\n• Check back in a few days for new postings"
	}

	return finalResponse
}

func (s *JobAIService) prepareAIMessages(userMessage string, history []models.JobChatMessage, userProfile *models.User) []services.AIMessage {
	messages := []services.AIMessage{
		{
			Role: "system",
			Content: `You are JobMate's Gemini-powered job matching assistant for Ethiopian job seekers.
				Your task is to:

				1. Extract job search criteria from user messages
				2. Return a JSON object with the criteria
				3. Provide helpful, natural language responses

				CRITICAL: You MUST include BOTH:
				- A natural language response to the user
				- A JSON object with the extracted criteria

				JSON FORMAT:
				{
				"experience": "entry-level/mid-level/senior",
				"field": "job field",
				"language": "en/am", 
				"looking_for": "local/remote/freelance",
				"skills": ["skill1", "skill2"]
				}

				EXAMPLES:
				User: "I want remote software jobs with Python"
				Response: "Great! I'll search for remote Python software jobs for you.{\"experience\":\"\",\"field\":\"software development\",\"language\":\"en\",\"looking_for\":\"remote\",\"skills\":[\"Python\"]}"

				User: "I have 5 years experience in marketing"
				Response: "Thanks for sharing your experience! What type of marketing position are you looking for (local, remote, or freelance)?{\"experience\":\"mid-level\",\"field\":\"marketing\",\"language\":\"en\",\"looking_for\":\"\",\"skills\":[]}"

				Make the response warm, concise, and confidence-building. If the user writes Amharic, reply in Amharic.`,
		},
	}

	// Add chat history
	for _, msg := range history {
		messages = append(messages, services.AIMessage{
			Role:    msg.Role,
			Content: msg.Message,
		})
	}

	// Add current user message
	messages = append(messages, services.AIMessage{
		Role:    "user",
		Content: userMessage,
	})

	return messages
}

func (s *JobAIService) saveChatHistory(ctx context.Context, userID string, chatID string, userMessage string, aiResponse string, criteria *dto.JobSearchCriteriaDTO, jobs []models.Job) *models.JobAIResponse {
	response := &models.JobAIResponse{
		Message: aiResponse,
	}

	userMsg := models.JobChatMessage{
		Role:      "user",
		Message:   userMessage,
		Timestamp: time.Now(),
	}

	assistantMsg := models.JobChatMessage{
		Role:      "assistant",
		Message:   aiResponse,
		Jobs:      jobs,
		Timestamp: time.Now(),
	}

	var err error
	query := map[string]any{
		"field":       "",
		"looking_for": "",
		"skills":      []string{},
		"experience":  "",
		"language":    "en",
	}

	// Update query if criteria is available
	if criteria != nil {
		query["field"] = criteria.Field
		query["looking_for"] = criteria.LookingFor
		query["skills"] = criteria.Skills
		query["experience"] = criteria.Experience
		query["language"] = criteria.Language
	}

	if chatID == "" {
		// Create new chat
		chatID, err = s.JobChatRepo.CreateJobChat(ctx, userID, query, jobs, []models.JobChatMessage{userMsg, assistantMsg})
		if err != nil {
			log.Printf("Failed to create chat: %v", err)
		} else {
			response.ChatID = chatID
		}
	} else {
		// Append to existing chat
		err = s.JobChatRepo.AppendMessage(ctx, chatID, userMsg)
		if err != nil {
			log.Printf("Failed to append user message: %v", err)
		}
		err = s.JobChatRepo.AppendMessage(ctx, chatID, assistantMsg)
		if err != nil {
			log.Printf("Failed to append assistant message: %v", err)
		}
		if err = s.JobChatRepo.UpdateSearchResults(ctx, chatID, query, jobs); err != nil {
			log.Printf("Failed to update job search results: %v", err)
		}
		response.ChatID = chatID
	}

	return response
}

package usecases

import (
	"context"
	"fmt"
	"log"
	"regexp"
	"strings"

	"mime/multipart"
	"time"

	"github.com/tsigemariamzewdu/JobMate-backend/domain"
	repo "github.com/tsigemariamzewdu/JobMate-backend/domain/interfaces/repositories"

	service "github.com/tsigemariamzewdu/JobMate-backend/domain/interfaces/services"

	usecase "github.com/tsigemariamzewdu/JobMate-backend/domain/interfaces/usecases"

	model "github.com/tsigemariamzewdu/JobMate-backend/domain/models"
)

type CVUsecase struct {
	cvRepo        repo.CVRepository
	feedbackRepo  repo.FeedbackRepository
	skillGapRepo  repo.SkillGapRepository
	aiService     service.AISuggestionService
	textExtractor service.TextExtractor
	timeout       time.Duration
}

func NewCVUsecase(
	cvRepo repo.CVRepository,
	feedbackRepo repo.FeedbackRepository,
	skillGapRepo repo.SkillGapRepository,
	aiService service.AISuggestionService,
	textExtractor service.TextExtractor,
	timeout time.Duration,
) usecase.ICVUsecase {
	return &CVUsecase{
		cvRepo:        cvRepo,
		feedbackRepo:  feedbackRepo,
		skillGapRepo:  skillGapRepo,
		aiService:     aiService,
		textExtractor: textExtractor,
		timeout:       timeout,
	}
}

func (uc *CVUsecase) Upload(ctx context.Context, userID string, rawText string, file *multipart.FileHeader) (*model.CV, error) {

	c, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	if rawText == "" && file != nil {
		text, err := uc.textExtractor.Extract(file)
		if err != nil {
			return nil, fmt.Errorf("failed to extract text from file: %w", err)
		}

		rawText = text
	}

	cv := &model.CV{
		UserID:       userID,
		FileName:     "",
		OriginalText: rawText,
		IsActive:     true,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if file != nil {
		cv.FileName = file.Filename
	}

	id, err := uc.cvRepo.Create(c, cv)
	if err != nil {
		return nil, fmt.Errorf("failed to create CV in repository: %w", err)
	}
	cv.ID = id
	return cv, nil
}

func (uc *CVUsecase) Analyze(ctx context.Context, cvID string) (*model.AISuggestions, error) {
	c, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	cv, err := uc.cvRepo.GetByID(c, cvID)
	if err != nil {
		return nil, err
	}

	// Generate AI suggestions
	suggestions, err := uc.aiService.Analyze(c, cv.OriginalText)
	if err != nil {
		log.Printf("CV AI analysis unavailable, using local fallback: %v", err)
		suggestions = buildLocalCVSuggestions(cv.OriginalText)
	}

	// Update CV
	cv.ExtractedSkills = suggestions.CVs.ExtractedSkills
	cv.ExtractedExperience = suggestions.CVs.ExtractedExperience
	cv.ExtractedEducation = suggestions.CVs.ExtractedEducation
	cv.Summary = suggestions.CVs.Summary
	cv.UpdatedAt = time.Now()

	if err := uc.cvRepo.Update(c, cv); err != nil {
		return nil, domain.ErrCVUpdateFailed
	}

	// Save feedback
	feedback := &model.CVFeedback{
		UserID:                 cv.UserID,
		CVID:                   cv.ID,
		Strengths:              suggestions.CVFeedback.Strengths,
		Weaknesses:             suggestions.CVFeedback.Weaknesses,
		ImprovementSuggestions: suggestions.CVFeedback.ImprovementSuggestions,
		GeneratedAt:            time.Now(),
	}

	if _, err := uc.feedbackRepo.Create(c, feedback); err != nil {
		log.Printf("failed to save CV feedback: %v", err)
	}

	// Save skill gaps
	var gaps []*model.SkillGap
	for _, g := range suggestions.SkillGaps {
		gaps = append(gaps, &model.SkillGap{
			UserID:                 cv.UserID,
			SkillName:              g.SkillName,
			CurrentLevel:           g.CurrentLevel,
			RecommendedLevel:       g.RecommendedLevel,
			Importance:             model.Importance(g.Importance),
			ImprovementSuggestions: g.ImprovementSuggestions,
			CreatedAt:              time.Now(),
			UpdatedAt:              time.Now(),
		})
	}

	if len(gaps) > 0 {
		if err := uc.skillGapRepo.CreateMany(c, gaps); err != nil {
			log.Printf("failed to save skill gaps: %v", err)
		}
	}

	return suggestions, nil
}

func (uc *CVUsecase) GenerateSuggestions(ctx context.Context, userID string) (*model.Suggestion, error) {
	c, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// Get latest CV
	cv, err := uc.cvRepo.GetLatestByUserID(c, userID)
	if err != nil {
		return nil, domain.ErrCVNotFound
	}

	//check if cv has been analyzed
	if len(cv.ExtractedSkills) == 0 && len(cv.ExtractedExperience) == 0 &&
		len(cv.ExtractedEducation) == 0 && strings.TrimSpace(cv.Summary) == "" {
		return nil, domain.ErrCVNotAnalyzed
	}

	// Get skill gaps
	skillGaps, err := uc.skillGapRepo.GetByUserID(c, userID)
	if err != nil {
		skillGaps = []*model.SkillGap{}
	}

	// Use AI to generate suggestions
	suggestions, err := uc.aiService.GenerateSuggestions(c, cv, skillGaps)
	if err != nil {
		log.Printf("Course AI suggestions unavailable, using local fallback: %v", err)
		return buildLocalCourseSuggestions(cv, skillGaps), nil
	}

	return suggestions, nil
}

func buildLocalCVSuggestions(cvText string) *model.AISuggestions {
	text := strings.TrimSpace(cvText)
	preview := text
	if len(preview) > 240 {
		preview = preview[:240] + "..."
	}

	skills := inferSkillsFromText(text)
	if len(skills) == 0 {
		skills = []string{"communication", "problem solving", "adaptability"}
	}

	suggestions := &model.AISuggestions{}
	suggestions.CVs.ExtractedSkills = skills
	suggestions.CVs.ExtractedExperience = []string{}
	suggestions.CVs.ExtractedEducation = []string{}
	suggestions.CVs.Summary = "Local analysis: " + preview
	suggestions.CVFeedback.Strengths = "Your CV gives useful background for career matching. Keep your strongest achievements visible near the top."
	suggestions.CVFeedback.Weaknesses = "Some sections may need clearer metrics, role-specific keywords, and stronger evidence of impact."
	suggestions.CVFeedback.ImprovementSuggestions = "Add measurable results, tailor the summary to the target job, and mirror important keywords from the vacancy description."

	for i, skill := range skills {
		if i >= 4 {
			break
		}
		suggestions.SkillGaps = append(suggestions.SkillGaps, struct {
			SkillName              string
			CurrentLevel           int
			RecommendedLevel       int
			Importance             string
			ImprovementSuggestions string
		}{
			SkillName:              skill,
			CurrentLevel:           3,
			RecommendedLevel:       5,
			Importance:             "important",
			ImprovementSuggestions: "Build a small portfolio example and describe the result with numbers where possible.",
		})
	}

	return suggestions
}

func buildLocalCourseSuggestions(cv *model.CV, skillGaps []*model.SkillGap) *model.Suggestion {
	skills := cv.ExtractedSkills
	if len(skillGaps) > 0 {
		skills = []string{}
		for _, gap := range skillGaps {
			if strings.TrimSpace(gap.SkillName) != "" {
				skills = append(skills, gap.SkillName)
			}
		}
	}
	if len(skills) == 0 {
		skills = []string{"communication", "interview preparation", "digital skills"}
	}

	courses := make([]model.CourseSuggestion, 0, 3)
	for i, skill := range skills {
		if i >= 3 {
			break
		}
		courses = append(courses, model.CourseSuggestion{
			Title:       fmt.Sprintf("%s essentials", titleCase(skill)),
			Provider:    "Coursera",
			URL:         "https://www.coursera.org/search?query=" + strings.ReplaceAll(skill, " ", "%20"),
			Description: "A practical starting point based on your CV analysis.",
			Skill:       skill,
		})
	}

	return &model.Suggestion{
		Courses: courses,
		GeneralAdvice: []string{
			"Turn each important skill into one project, result, or portfolio proof point.",
			"Update your CV summary so it matches the exact role you want next.",
			"Practice explaining your strongest project in under two minutes.",
		},
	}
}

func inferSkillsFromText(text string) []string {
	knownSkills := []string{
		"javascript", "typescript", "react", "next.js", "node", "go", "golang", "python",
		"java", "sql", "mongodb", "postgres", "figma", "excel", "data analysis",
		"marketing", "sales", "project management", "leadership", "communication",
	}
	lower := strings.ToLower(text)
	seen := map[string]bool{}
	var skills []string
	for _, skill := range knownSkills {
		if strings.Contains(lower, skill) && !seen[skill] {
			seen[skill] = true
			skills = append(skills, skill)
		}
	}

	if len(skills) > 0 {
		return skills
	}

	words := regexp.MustCompile(`[A-Za-z][A-Za-z+#.]{2,}`).FindAllString(text, -1)
	for _, word := range words {
		clean := strings.ToLower(strings.Trim(word, ".,;:()[]{}"))
		if len(clean) < 4 || seen[clean] {
			continue
		}
		seen[clean] = true
		skills = append(skills, clean)
		if len(skills) >= 5 {
			break
		}
	}
	return skills
}

func titleCase(value string) string {
	words := strings.Fields(value)
	for i, word := range words {
		words[i] = strings.ToUpper(word[:1]) + word[1:]
	}
	return strings.Join(words, " ")
}

package ai

import (
	"context"
	"fmt"
	"strings"

	"github.com/tsigemariamzewdu/JobMate-backend/delivery/dto"
	interfaces "github.com/tsigemariamzewdu/JobMate-backend/domain/interfaces/services"
)

type GroqServiceAdapter struct {
	groqClient *GroqClient
}

func NewGroqServiceAdapter(groqClient *GroqClient) interfaces.IAIService {
	return &GroqServiceAdapter{
		groqClient: groqClient,
	}
}

// GetChatCompletion implements IAIService interface
func (g *GroqServiceAdapter) GetChatCompletion(ctx context.Context, messages []interfaces.AIMessage, tools []interfaces.AITool) (*interfaces.AIResponse, error) {
	// Convert domain messages to DTOs
	groqMessages := make([]dto.GroqAIMessageDTO, 0, len(messages)+1)
	if len(tools) > 0 {
		groqMessages = append(groqMessages, dto.GroqAIMessageDTO{
			Role:    "system",
			Content: buildGroqToolInstruction(tools),
		})
	}

	for _, msg := range messages {
		role := msg.Role
		content := msg.Content
		if role == "tool" {
			role = "user"
			content = fmt.Sprintf("Tool result for %s:\n%s", msg.ToolCallID, msg.Content)
		}
		if strings.TrimSpace(content) == "" {
			continue
		}
		groqMessages = append(groqMessages, dto.GroqAIMessageDTO{
			Role:    role,
			Content: content,
		})
	}

	if len(groqMessages) == 0 {
		return nil, fmt.Errorf("Groq request has no messages")
	}

	response, err := g.groqClient.GetChatCompletion(ctx, groqMessages)
	if err != nil {
		return nil, err
	}

	// Convert Groq response to domain response
	return &interfaces.AIResponse{
		Content: response.Content,
	}, nil
}

func (g *GroqServiceAdapter) GetCompletion(ctx context.Context, prompt string) (*interfaces.AIResponse, error) {
	messages := []dto.GroqAIMessageDTO{
		{Role: "user", Content: prompt},
	}

	response, err := g.groqClient.GetChatCompletion(ctx, messages)
	if err != nil {
		return nil, err
	}

	return &interfaces.AIResponse{
		Content: response.Content,
	}, nil
}

func buildGroqToolInstruction(tools []interfaces.AITool) string {
	var b strings.Builder
	b.WriteString("You cannot call tools directly. If a tool is needed, respond with natural language using the available context. Available tool names and purposes:\n")
	for _, tool := range tools {
		if tool.Type != "function" {
			continue
		}
		b.WriteString("- ")
		b.WriteString(tool.Function.Name)
		if tool.Function.Description != "" {
			b.WriteString(": ")
			b.WriteString(tool.Function.Description)
		}
		b.WriteString("\n")
	}
	b.WriteString("Never mention internal tool names unless the user asks about implementation.")
	return b.String()
}

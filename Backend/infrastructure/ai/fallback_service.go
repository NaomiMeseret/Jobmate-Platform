package ai

import (
	"context"
	"fmt"
	"log"
	"strings"

	interfaces "github.com/tsigemariamzewdu/JobMate-backend/domain/interfaces/services"
)

type ProviderFallbackService struct {
	primary      interfaces.IAIService
	fallback     interfaces.IAIService
	primaryName  string
	fallbackName string
}

func NewProviderFallbackService(primary interfaces.IAIService, fallback interfaces.IAIService, primaryName string, fallbackName string) interfaces.IAIService {
	return &ProviderFallbackService{
		primary:      primary,
		fallback:     fallback,
		primaryName:  primaryName,
		fallbackName: fallbackName,
	}
}

func (s *ProviderFallbackService) GetChatCompletion(ctx context.Context, messages []interfaces.AIMessage, tools []interfaces.AITool) (*interfaces.AIResponse, error) {
	if s.primary != nil {
		response, err := s.primary.GetChatCompletion(ctx, messages, tools)
		if err == nil && responseHasContent(response) {
			return response, nil
		}
		log.Printf("%s AI provider failed, trying %s fallback: %v", s.primaryName, s.fallbackName, err)
	}

	if s.fallback != nil {
		response, err := s.fallback.GetChatCompletion(ctx, messages, tools)
		if err == nil && responseHasContent(response) {
			return response, nil
		}
		return response, fmt.Errorf("%s fallback failed: %w", s.fallbackName, err)
	}

	return nil, fmt.Errorf("no AI provider is configured")
}

func (s *ProviderFallbackService) GetCompletion(ctx context.Context, prompt string) (*interfaces.AIResponse, error) {
	if s.primary != nil {
		response, err := s.primary.GetCompletion(ctx, prompt)
		if err == nil && responseHasContent(response) {
			return response, nil
		}
		log.Printf("%s AI provider failed, trying %s fallback: %v", s.primaryName, s.fallbackName, err)
	}

	if s.fallback != nil {
		response, err := s.fallback.GetCompletion(ctx, prompt)
		if err == nil && responseHasContent(response) {
			return response, nil
		}
		return response, fmt.Errorf("%s fallback failed: %w", s.fallbackName, err)
	}

	return nil, fmt.Errorf("no AI provider is configured")
}

func responseHasContent(response *interfaces.AIResponse) bool {
	if response == nil {
		return false
	}
	return strings.TrimSpace(response.Content) != "" || len(response.ToolCalls) > 0
}

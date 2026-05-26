package infrastructure

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	svc "github.com/tsigemariamzewdu/JobMate-backend/domain/interfaces/services"
)

const brevoTransactionalEmailURL = "https://api.brevo.com/v3/smtp/email"

type BrevoAPIService struct {
	apiKey    string
	fromEmail string
	fromName  string
	client    *http.Client
}

var _ svc.IEmailService = (*BrevoAPIService)(nil)

type brevoEmailAddress struct {
	Email string `json:"email"`
	Name  string `json:"name,omitempty"`
}

type brevoEmailRequest struct {
	Sender      brevoEmailAddress   `json:"sender"`
	To          []brevoEmailAddress `json:"to"`
	Subject     string              `json:"subject"`
	HTMLContent string              `json:"htmlContent"`
}

func NewBrevoAPIService(apiKey, fromEmail, fromName string) svc.IEmailService {
	if strings.TrimSpace(fromName) == "" {
		fromName = "JobMate"
	}

	return &BrevoAPIService{
		apiKey:    strings.TrimSpace(apiKey),
		fromEmail: strings.TrimSpace(fromEmail),
		fromName:  strings.TrimSpace(fromName),
		client: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

func (s *BrevoAPIService) SendEmail(to, subject, body string) error {
	if s.apiKey == "" {
		return fmt.Errorf("brevo api key is missing")
	}
	if s.fromEmail == "" {
		return fmt.Errorf("sender email is missing")
	}

	payload := brevoEmailRequest{
		Sender: brevoEmailAddress{
			Email: s.fromEmail,
			Name:  s.fromName,
		},
		To: []brevoEmailAddress{
			{Email: to},
		},
		Subject:     subject,
		HTMLContent: body,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("encode brevo email request: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, brevoTransactionalEmailURL, bytes.NewReader(payloadBytes))
	if err != nil {
		return fmt.Errorf("create brevo email request: %w", err)
	}

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("api-key", s.apiKey)

	resp, err := s.client.Do(req)
	if err != nil {
		return fmt.Errorf("brevo email request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		responseBody, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return fmt.Errorf("brevo email rejected: status=%d body=%s", resp.StatusCode, strings.TrimSpace(string(responseBody)))
	}

	return nil
}

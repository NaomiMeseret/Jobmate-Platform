package infrastructure

import (
	svc "github.com/tsigemariamzewdu/JobMate-backend/domain/interfaces/services"
	config "github.com/tsigemariamzewdu/JobMate-backend/infrastructure/config"
	"gopkg.in/gomail.v2"
)

type ISMTPDialer interface {
	DialAndSend(...*gomail.Message) error
}

type SMTPService struct {
	dialer    ISMTPDialer
	EmailFrom string
}

func NewEmailService(cfg *config.Config) svc.IEmailService {
	if cfg != nil && cfg.BrevoAPIKey != "" {
		return NewBrevoAPIService(cfg.BrevoAPIKey, cfg.EmailFrom, cfg.EmailFromName)
	}

	return NewSMTPService(cfg.SMTPHost, cfg.SMTPPort, cfg.SMTPUsername, cfg.SMTPPassword, cfg.EmailFrom)
}

func NewSMTPService(SMTPHost string, SMTPPort int, SMTPUsername string, SMTPPassword string, EmailFrom string) svc.IEmailService {
	d := gomail.NewDialer(SMTPHost, SMTPPort, SMTPUsername, SMTPPassword)
	return &SMTPService{
		dialer:    d,
		EmailFrom: EmailFrom,
	}
}
func (s *SMTPService) SendEmail(to, subject, body string) error {

	m := gomail.NewMessage()
	m.SetHeader("From", s.EmailFrom)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	return s.dialer.DialAndSend(m)
}

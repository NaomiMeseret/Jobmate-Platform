package usecases

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	repoInterfaces "github.com/tsigemariamzewdu/JobMate-backend/domain/interfaces/repositories"
	"github.com/tsigemariamzewdu/JobMate-backend/domain/models"
	"github.com/tsigemariamzewdu/JobMate-backend/infrastructure/payment"
	"github.com/tsigemariamzewdu/JobMate-backend/repositories"
)

type PaymentUsecase struct {
	PaymentRepo *repositories.PaymentRepository
	AuthRepo    repoInterfaces.IAuthRepository
	ChapaClient *payment.ChapaClient
	FrontendURL string
	BackendURL  string
}

type PaymentInitResult struct {
	CheckoutURL string `json:"checkout_url"`
	TxRef       string `json:"tx_ref"`
	Provider    string `json:"provider"`
	PlanID      string `json:"plan_id"`
}

var supportedPlans = map[string]models.Plan{
	"career_pro_et": {
		ID:       "career_pro_et",
		Name:     "Career Pro",
		Amount:   299,
		Currency: "ETB",
		Country:  "ET",
		Provider: models.PaymentProviderChapa,
	},
}

func NewPaymentUsecase(paymentRepo *repositories.PaymentRepository, authRepo repoInterfaces.IAuthRepository, chapaClient *payment.ChapaClient, frontendURL string, backendURL string) *PaymentUsecase {
	return &PaymentUsecase{
		PaymentRepo: paymentRepo,
		AuthRepo:    authRepo,
		ChapaClient: chapaClient,
		FrontendURL: strings.TrimRight(frontendURL, "/"),
		BackendURL:  strings.TrimRight(backendURL, "/"),
	}
}

func (u *PaymentUsecase) InitializeChapa(ctx context.Context, userID string, planID string, country string) (*PaymentInitResult, error) {
	country = strings.ToUpper(strings.TrimSpace(country))
	if country != "ET" {
		return nil, fmt.Errorf("Career Pro payments are currently available only in Ethiopia")
	}

	plan, ok := supportedPlans[planID]
	if !ok {
		return nil, fmt.Errorf("unsupported plan")
	}

	user, err := u.AuthRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to load user profile: %w", err)
	}
	email := valueOrDefault(user.Email, "")
	if email == "" {
		return nil, fmt.Errorf("user email is required for payment")
	}

	txRef := buildPaymentTxRef()
	req := payment.InitializeRequest{
		Amount:      fmt.Sprintf("%.0f", plan.Amount),
		Currency:    plan.Currency,
		Email:       email,
		FirstName:   valueOrDefault(user.FirstName, "JobMate"),
		LastName:    valueOrDefault(user.LastName, "User"),
		TxRef:       txRef,
		CallbackURL: u.BackendURL + "/payments/chapa/callback?tx_ref=" + txRef,
		ReturnURL:   u.FrontendURL + "/payment/success?tx_ref=" + txRef,
	}
	req.Customization.Title = "JobMate Pro"
	req.Customization.Description = "Career Pro plan"

	chapaResponse, err := u.ChapaClient.Initialize(ctx, req)
	if err != nil {
		return nil, err
	}

	paymentRecord := &models.Payment{
		UserID:      userID,
		PlanID:      plan.ID,
		Provider:    plan.Provider,
		TxRef:       txRef,
		Amount:      plan.Amount,
		Currency:    plan.Currency,
		Country:     country,
		Status:      models.PaymentStatusPending,
		CheckoutURL: chapaResponse.Data.CheckoutURL,
	}
	if _, err := u.PaymentRepo.Create(ctx, paymentRecord); err != nil {
		return nil, err
	}

	return &PaymentInitResult{
		CheckoutURL: chapaResponse.Data.CheckoutURL,
		TxRef:       txRef,
		Provider:    string(plan.Provider),
		PlanID:      plan.ID,
	}, nil
}

func (u *PaymentUsecase) VerifyChapa(ctx context.Context, txRef string) (*models.Payment, error) {
	paymentRecord, err := u.PaymentRepo.GetByTxRef(ctx, txRef)
	if err != nil {
		return nil, err
	}

	verifyResponse, err := u.ChapaClient.Verify(ctx, txRef)
	if err != nil {
		_ = u.PaymentRepo.UpdateStatus(ctx, txRef, models.PaymentStatusFailed)
		return nil, err
	}

	status := strings.ToLower(verifyResponse.Data.Status)
	if status == "success" || status == "paid" {
		if err := u.PaymentRepo.UpdateStatus(ctx, txRef, models.PaymentStatusPaid); err != nil {
			return nil, err
		}
		paymentRecord.Status = models.PaymentStatusPaid
		now := time.Now()
		paymentRecord.PaidAt = &now
		return paymentRecord, nil
	}

	_ = u.PaymentRepo.UpdateStatus(ctx, txRef, models.PaymentStatusFailed)
	paymentRecord.Status = models.PaymentStatusFailed
	return paymentRecord, nil
}

func valueOrDefault(value *string, fallback string) string {
	if value == nil || strings.TrimSpace(*value) == "" {
		return fallback
	}
	return strings.TrimSpace(*value)
}

func buildPaymentTxRef() string {
	randomBytes := make([]byte, 6)
	if _, err := rand.Read(randomBytes); err != nil {
		return fmt.Sprintf("jm-%d", time.Now().UnixNano())
	}
	return fmt.Sprintf("jm-%d-%s", time.Now().Unix(), hex.EncodeToString(randomBytes))
}

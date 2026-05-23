package models

import "time"

type PaymentStatus string

const (
	PaymentStatusPending PaymentStatus = "pending"
	PaymentStatusPaid    PaymentStatus = "paid"
	PaymentStatusFailed  PaymentStatus = "failed"
)

type PaymentProvider string

const (
	PaymentProviderChapa PaymentProvider = "chapa"
)

type Payment struct {
	ID          string          `bson:"_id,omitempty" json:"id"`
	UserID      string          `bson:"user_id" json:"user_id"`
	PlanID      string          `bson:"plan_id" json:"plan_id"`
	Provider    PaymentProvider `bson:"provider" json:"provider"`
	TxRef       string          `bson:"tx_ref" json:"tx_ref"`
	Amount      float64         `bson:"amount" json:"amount"`
	Currency    string          `bson:"currency" json:"currency"`
	Country     string          `bson:"country" json:"country"`
	Status      PaymentStatus   `bson:"status" json:"status"`
	CheckoutURL string          `bson:"checkout_url,omitempty" json:"checkout_url,omitempty"`
	CreatedAt   time.Time       `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time       `bson:"updated_at" json:"updated_at"`
	PaidAt      *time.Time      `bson:"paid_at,omitempty" json:"paid_at,omitempty"`
}

type Plan struct {
	ID       string
	Name     string
	Amount   float64
	Currency string
	Country  string
	Provider PaymentProvider
}

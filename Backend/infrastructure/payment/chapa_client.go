package payment

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type ChapaClient struct {
	SecretKey  string
	BaseURL    string
	HTTPClient *http.Client
}

type InitializeRequest struct {
	Amount        string `json:"amount"`
	Currency      string `json:"currency"`
	Email         string `json:"email"`
	FirstName     string `json:"first_name,omitempty"`
	LastName      string `json:"last_name,omitempty"`
	TxRef         string `json:"tx_ref"`
	CallbackURL   string `json:"callback_url"`
	ReturnURL     string `json:"return_url"`
	Customization struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	} `json:"customization"`
}

type FlexibleMessage string

func (m *FlexibleMessage) UnmarshalJSON(data []byte) error {
	var text string
	if err := json.Unmarshal(data, &text); err == nil {
		*m = FlexibleMessage(text)
		return nil
	}

	var object map[string]any
	if err := json.Unmarshal(data, &object); err == nil {
		encoded, _ := json.Marshal(object)
		*m = FlexibleMessage(string(encoded))
		return nil
	}

	var list []any
	if err := json.Unmarshal(data, &list); err == nil {
		encoded, _ := json.Marshal(list)
		*m = FlexibleMessage(string(encoded))
		return nil
	}

	*m = FlexibleMessage(strings.TrimSpace(string(data)))
	return nil
}

func (m FlexibleMessage) String() string {
	value := strings.TrimSpace(string(m))
	if value == "" {
		return "unknown Chapa response"
	}
	return value
}

type FlexibleString string

func (s *FlexibleString) UnmarshalJSON(data []byte) error {
	var text string
	if err := json.Unmarshal(data, &text); err == nil {
		*s = FlexibleString(text)
		return nil
	}

	var number float64
	if err := json.Unmarshal(data, &number); err == nil {
		*s = FlexibleString(strconv.FormatFloat(number, 'f', -1, 64))
		return nil
	}

	*s = FlexibleString(strings.TrimSpace(string(data)))
	return nil
}

type InitializeResponse struct {
	Status  string          `json:"status"`
	Message FlexibleMessage `json:"message"`
	Data    struct {
		CheckoutURL string `json:"checkout_url"`
	} `json:"data"`
}

type VerifyResponse struct {
	Status  string          `json:"status"`
	Message FlexibleMessage `json:"message"`
	Data    struct {
		Status   string         `json:"status"`
		TxRef    string         `json:"tx_ref"`
		Currency string         `json:"currency"`
		Amount   FlexibleString `json:"amount"`
	} `json:"data"`
}

func NewChapaClient(secretKey string, baseURL string) *ChapaClient {
	baseURL = strings.TrimRight(strings.TrimSpace(baseURL), "/")
	if baseURL == "" {
		baseURL = "https://api.chapa.co/v1"
	}
	return &ChapaClient{
		SecretKey:  strings.TrimSpace(secretKey),
		BaseURL:    baseURL,
		HTTPClient: &http.Client{Timeout: 20 * time.Second},
	}
}

func (c *ChapaClient) Initialize(ctx context.Context, reqBody InitializeRequest) (*InitializeResponse, error) {
	if c.SecretKey == "" {
		return nil, fmt.Errorf("Chapa secret key is not configured")
	}

	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(reqBody); err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.BaseURL+"/transaction/initialize", &buf)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.SecretKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result InitializeResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("Chapa initialize failed: %s", result.Message.String())
	}
	if result.Data.CheckoutURL == "" {
		return nil, fmt.Errorf("Chapa initialize returned no checkout URL")
	}
	return &result, nil
}

func (c *ChapaClient) Verify(ctx context.Context, txRef string) (*VerifyResponse, error) {
	if c.SecretKey == "" {
		return nil, fmt.Errorf("Chapa secret key is not configured")
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.BaseURL+"/transaction/verify/"+txRef, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.SecretKey)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result VerifyResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("Chapa verify failed: %s", result.Message.String())
	}
	return &result, nil
}

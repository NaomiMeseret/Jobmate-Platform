package controllers

import (
	"context"
	"errors"
	"time"

	"github.com/tsigemariamzewdu/JobMate-backend/delivery/dto"
	"github.com/tsigemariamzewdu/JobMate-backend/domain/models"
	"github.com/tsigemariamzewdu/JobMate-backend/usecases"

	"net/http"

	"github.com/gin-gonic/gin"
)

type OtpController struct {
	AuthUsecase *usecases.OTPUsecase
}

func NewOtpController(authUsecase *usecases.OTPUsecase) *OtpController {
	return &OtpController{AuthUsecase: authUsecase}
}

// POST /auth/request-otp
func (c *OtpController) RequestOTP(ctx *gin.Context) {
	var req dto.OTPRequestDTO
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, dto.OTPResponseDTO{Message: "Invalid request"})
		return
	}
	// Get requestor IP
	ip := ctx.ClientIP()
	otpReq := dtoToDomainOTPRequest(req, ip)
	if err := c.AuthUsecase.RequestOTP(context.Background(), &otpReq); err != nil {
		switch {
		case errors.Is(err, usecases.ErrEmailValidationFailed):
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email address"})
		case errors.Is(err, usecases.ErrRateLimited):
			ctx.JSON(http.StatusTooManyRequests, gin.H{"error": "Too many OTP requests, please try again later"})
		default:
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
		}
		return
	}
	ctx.JSON(http.StatusOK, dto.OTPResponseDTO{Message: "If this email exists, a code was sent"})

}

func dtoToDomainOTPRequest(req dto.OTPRequestDTO, ip string) models.OTPRequest {
	return models.OTPRequest{
		Email:       req.Email,
		RequestorIP: ip,
	}
}

// RequestPasswordResetOTP handles password reset OTP requests
func (oc *OtpController) RequestPasswordResetOTP(c *gin.Context) {
	ctx := c.Request.Context()

	var input struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	err := oc.AuthUsecase.RequestPasswordResetOTP(ctx, input.Email)
	if err != nil {
		// Generic error handling - you can customize this based on your needs
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to send password reset OTP",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset OTP sent to your email"})
}

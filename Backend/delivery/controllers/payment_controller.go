package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tsigemariamzewdu/JobMate-backend/usecases"
)

type PaymentController struct {
	PaymentUsecase *usecases.PaymentUsecase
}

type InitializePaymentRequest struct {
	PlanID  string `json:"plan_id" binding:"required"`
	Country string `json:"country" binding:"required"`
}

type ChapaCallbackRequest struct {
	TxRef string `json:"tx_ref"`
}

func NewPaymentController(paymentUsecase *usecases.PaymentUsecase) *PaymentController {
	return &PaymentController{PaymentUsecase: paymentUsecase}
}

func (c *PaymentController) InitializeChapa(ctx *gin.Context) {
	userID := ctx.GetString("userID")
	if userID == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var req InitializePaymentRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment request"})
		return
	}

	result, err := c.PaymentUsecase.InitializeChapa(ctx.Request.Context(), userID, req.PlanID, req.Country)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, result)
}

func (c *PaymentController) VerifyChapa(ctx *gin.Context) {
	txRef := ctx.Param("tx_ref")
	if txRef == "" {
		txRef = ctx.Query("tx_ref")
	}
	if txRef == "" {
		var req ChapaCallbackRequest
		if err := ctx.ShouldBindJSON(&req); err == nil {
			txRef = req.TxRef
		}
	}
	if txRef == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "tx_ref is required"})
		return
	}

	payment, err := c.PaymentUsecase.VerifyChapa(ctx.Request.Context(), txRef)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"payment": payment})
}

func (c *PaymentController) ChapaCallback(ctx *gin.Context) {
	c.VerifyChapa(ctx)
}

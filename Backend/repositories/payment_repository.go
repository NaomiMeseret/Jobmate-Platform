package repositories

import (
	"context"
	"time"

	"github.com/tsigemariamzewdu/JobMate-backend/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type PaymentRepository struct {
	collection *mongo.Collection
}

func NewPaymentRepository(db *mongo.Database) *PaymentRepository {
	return &PaymentRepository{collection: db.Collection("payments")}
}

func (r *PaymentRepository) Create(ctx context.Context, payment *models.Payment) (string, error) {
	now := time.Now()
	payment.CreatedAt = now
	payment.UpdatedAt = now

	result, err := r.collection.InsertOne(ctx, payment)
	if err != nil {
		return "", err
	}
	return result.InsertedID.(primitive.ObjectID).Hex(), nil
}

func (r *PaymentRepository) GetByTxRef(ctx context.Context, txRef string) (*models.Payment, error) {
	var payment models.Payment
	if err := r.collection.FindOne(ctx, bson.M{"tx_ref": txRef}).Decode(&payment); err != nil {
		return nil, err
	}
	return &payment, nil
}

func (r *PaymentRepository) UpdateStatus(ctx context.Context, txRef string, status models.PaymentStatus) error {
	update := bson.M{
		"$set": bson.M{
			"status":     status,
			"updated_at": time.Now(),
		},
	}
	if status == models.PaymentStatusPaid {
		update["$set"].(bson.M)["paid_at"] = time.Now()
	}
	_, err := r.collection.UpdateOne(ctx, bson.M{"tx_ref": txRef}, update)
	return err
}

package mongo

import (
	"context"
	"log"
	"strings"
	"time"

	infrastructure "github.com/tsigemariamzewdu/JobMate-backend/infrastructure/config"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func NewMongoClient() *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// load configuration
	cfg, err := infrastructure.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	if cfg.DBUri == "" {
		log.Fatal("Mongo connection error: DB_URI is not set. Add DB_URI in your deployment environment variables.")
	}
	if !strings.HasPrefix(cfg.DBUri, "mongodb://") && !strings.HasPrefix(cfg.DBUri, "mongodb+srv://") {
		log.Fatal("Mongo connection error: DB_URI must start with mongodb:// or mongodb+srv://. Check your deployment environment variable value.")
	}

	// connect to MongoDB using the URI from config
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.DBUri))
	if err != nil {
		log.Fatalf("Mongo connection error: %v", err)
	}

	return client
}

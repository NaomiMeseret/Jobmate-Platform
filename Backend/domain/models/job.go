package models

type Job struct {
	Title        string   `bson:"title" json:"title"`
	Company      string   `bson:"company" json:"company"`
	Location     string   `bson:"location" json:"location"`
	Requirements []string `bson:"requirements" json:"requirements"`
	Type         string   `bson:"type" json:"type"` // "local", "remote", "freelance"
	Source       string   `bson:"source" json:"source"`
	Link         string   `bson:"link" json:"link"`
	Language     string   `bson:"language" json:"language"`
}

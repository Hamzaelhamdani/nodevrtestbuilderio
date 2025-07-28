#!/bin/bash

echo "🚀 Quick VenturesRoom Backend Setup (SQLite)"

echo "📦 Setting up SQLite database..."

# Run migrations
if npm run migrate; then
    echo "✅ Migrations complete"
else
    echo "❌ Migrations failed"
    exit 1
fi

echo "🎉 Setup complete! You can now run 'npm run dev'"

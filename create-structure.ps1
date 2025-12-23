Write-Host "🚀 Creating Angular Enterprise Folder Structure..."

# Core Module
New-Item -ItemType Directory -Force -Path src/app/core/guards
New-Item -ItemType Directory -Force -Path src/app/core/interceptors
New-Item -ItemType Directory -Force -Path src/app/core/services
New-Item -ItemType Directory -Force -Path src/app/core/helpers
New-Item -ItemType Directory -Force -Path src/app/core/models
New-Item -ItemType Directory -Force -Path src/app/core/http
New-Item -ItemType Directory -Force -Path src/app/core/config

# Shared
New-Item -ItemType Directory -Force -Path src/app/shared/components
New-Item -ItemType Directory -Force -Path src/app/shared/directives
New-Item -ItemType Directory -Force -Path src/app/shared/pipes
New-Item -ItemType Directory -Force -Path src/app/shared/utils

# Layouts
New-Item -ItemType Directory -Force -Path src/app/layouts/admin-layout/sidebar
New-Item -ItemType Directory -Force -Path src/app/layouts/admin-layout/navbar
New-Item -ItemType Directory -Force -Path src/app/layouts/client-layout/header
New-Item -ItemType Directory -Force -Path src/app/layouts/client-layout/footer

# Admin Features
$adminFolders = @(
    "dashboard","cars","roles-permissions","designs","users",
    "admins","profile","notifications","financing-requests","quizzes","faq"
)

foreach ($f in $adminFolders) {
    New-Item -ItemType Directory -Force -Path "src/app/features/admin/$f"
}

# Client Features
$clientFolders = @(
    "home","cars","about","contact-us","vlogs","finance","login","create-account"
)

foreach ($f in $clientFolders) {
    New-Item -ItemType Directory -Force -Path "src/app/features/$f"
}

# Auth Module
New-Item -ItemType Directory -Force -Path src/app/auth/login
New-Item -ItemType Directory -Force -Path src/app/auth/register

# State
New-Item -ItemType Directory -Force -Path src/app/state/stores
New-Item -ItemType Directory -Force -Path src/app/state/actions
New-Item -ItemType Directory -Force -Path src/app/state/reducers
New-Item -ItemType Directory -Force -Path src/app/state/selectors

Write-Host "🎉 Folder Structure Created Successfully!"

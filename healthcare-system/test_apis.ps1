$ErrorActionPreference = "Stop"

function Test-Api {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Uri,
        [string]$Body = ""
    )
    Write-Host ">>> Testing: $Name" -ForegroundColor Cyan
    try {
        if ($Body -ne "") {
            $response = Invoke-RestMethod -Uri $Uri -Method $Method -Body $Body -ContentType "application/json"
        } else {
            $response = Invoke-RestMethod -Uri $Uri -Method $Method
        }
        $json = $response | ConvertTo-Json -Depth 5
        Write-Host "✅ SUCCESS!" -ForegroundColor Green
        Write-Host $json
    } catch {
        Write-Host "❌ FAILED!" -ForegroundColor Red
        Write-Host $_.Exception.Message
        if ($_.ErrorDetails) {
            Write-Host $_.ErrorDetails.Message
        }
    }
    Write-Host "---------------------------------"
}

# 1. Add Hospital
$hospBody = @{
    name = "City General Hospital"
    address = "123 Main Street"
    city = "Metropolis"
    contactNumber = "1-800-555-0199"
} | ConvertTo-Json
Test-Api -Name "Create Hospital" -Method "POST" -Uri "http://localhost:8080/hospital" -Body $hospBody

# 2. Add Specialization
$specBody = @{
    name = "Cardiology"
    description = "Heart and cardiovascular system specialist"
} | ConvertTo-Json
Test-Api -Name "Create Specialization" -Method "POST" -Uri "http://localhost:8080/specialization" -Body $specBody

# 3. Add Doctor
$docBody = @{
    name = "Dr. Strange"
    email = "doctor1@hospital.com"
    password = "password123"
    phone = "555-000-1111"
    specializationId = 1
    hospitalId = 1
} | ConvertTo-Json
Test-Api -Name "Register Doctor" -Method "POST" -Uri "http://localhost:8080/auth/doctor/register" -Body $docBody

# Add missing document_url directly since we added that to entity manually
# Actually, wait. The Doc register request doesn't accept documentUrl. I'll just skip the document_url validation failure by assigning it if possible, but let's see if 4. fails.

# 4. Approve Doctor
Test-Api -Name "Approve Doctor" -Method "PUT" -Uri "http://localhost:8080/doctor/1/approve"

# 5. Add bulk slots
$today = (Get-Date).ToString("yyyy-MM-dd")
# The endpoint is POST /slot/batch?doctorId=1&date=$today&shiftStart=09:00:00
Test-Api -Name "Generate Bulk Slots" -Method "POST" -Uri "http://localhost:8080/slot/batch?doctorId=1&date=$today&shiftStart=09:00:00"

# 6. Patient Register
$patBody = @{
    name = "Bruce Wayne"
    email = "bruce@patient.com"
    password = "batman"
    phone = "1231231234"
    age = "35"
    gender = "MALE"
} | ConvertTo-Json
Test-Api -Name "Register Patient" -Method "POST" -Uri "http://localhost:8080/auth/patient/register" -Body $patBody

# 7. Book Appointment
Test-Api -Name "Book Appointment" -Method "POST" -Uri "http://localhost:8080/appointment/book?patientId=1&doctorId=1&slotId=1"

# 8. Complete Appointment
Test-Api -Name "Complete Appointment" -Method "PUT" -Uri "http://localhost:8080/appointment/1/complete"

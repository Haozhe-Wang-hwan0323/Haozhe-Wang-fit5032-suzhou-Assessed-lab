<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '', 
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: 'Clayton'
})

const submittedCards = ref([])

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null, 
  resident: null,      
  gender: null,         
  reason: null       
})

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateGender(true)
  validateReason(true)
  const hasErrors = Object.values(errors.value).some(err => err !== null)
  
  if (!hasErrors) {
    submittedCards.value.push({ ...formData.value })
    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '', 
    isAustralian: false,
    reason: '',
    gender: '',
    suburb: 'Clayton'
  }
  errors.value = { ...errors.value }
}
const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}
const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password needs an uppercase letter'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password needs a lowercase letter'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password needs a number'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password needs a special character'
  } else {
    errors.value.password = null
  }
}
const validateConfirmPassword = (blur) => {
  if (blur) {
    const password = formData.value.password
    const confirm = formData.value.confirmPassword
    if (confirm !== password) {
      errors.value.confirmPassword = 'Passwords do not match'
    } else {
      errors.value.confirmPassword = null
    }
  }
}
const validateGender = (blur) => {
  if (blur && !formData.value.gender) {
    errors.value.gender = 'Please select a gender'
  } else {
    errors.value.gender = null
  }
}
const validateReason = (blur) => {
  if (blur && formData.value.reason.length < 5) { 
    errors.value.reason = 'Reason must be at least 5 characters'
  } else {
    errors.value.reason = null
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">🗄️ W5. Library Registration Form</h1>
        <p class="text-center">
          Let's build some more advanced features into our form.
        </p>
        
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="gender" class="form-label">Gender</label>
              <select 
                class="form-select" 
                id="gender" 
                v-model="formData.gender" 
                @blur="() => validateGender(true)"
              >
                <option value="">Select Gender</option> 
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                type="password"
                class="form-control"
                id="confirm-password"
                @blur="() => validateConfirmPassword(true)"
                v-model="formData.confirmPassword"
              />
              <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="isAustralian"
                  v-model="formData.isAustralian"
                />
                <label class="form-check-label" for="isAustralian">Australian Resident?</label>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea
              class="form-control"
              id="reason"
              rows="3"
              v-model="formData.reason"
              @blur="() => validateReason(true)"
            ></textarea>
            <div v-if="errors.reason" class="text-danger">{{ errors.reason }}</div>
            <div v-else-if="formData.reason.includes('friend')" class="text-success">Great to have a friend</div>
          </div>
          <div class="mb-3">
            <label for="suburb" class="form-label">Suburb</label>
            <input 
              type="text" 
              class="form-control" 
              id="suburb" 
              v-model="formData.suburb" 
            />
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>
    <div class="row mt-5">
      <h4 class="mb-3">Submitted Data (PrimeVue Datatable)</h4>
      <DataTable :value="submittedCards" tableStyle="min-width: 60rem">
        <Column field="username" header="Username"></Column>
        <Column field="password" header="Password"></Column>
        <Column field="confirmPassword" header="Confirm Password"></Column>
        <Column field="isAustralian" header="Australian Resident"></Column>
        <Column field="gender" header="Gender"></Column>
        <Column field="reason" header="Reason"></Column>
        <Column field="suburb" header="Suburb"></Column>
      </DataTable>
    </div>
    <div class="row mt-5" v-if="submittedCards.length">
      <h4 class="mb-3">Submitted Cards</h4>
      <div class="d-flex flex-wrap gap-3">
        <div 
          v-for="(card, idx) in submittedCards" 
          :key="idx" 
          class="card" 
          style="width: 18rem"
        >
          <div class="card-header bg-primary text-white">User #{{ idx + 1 }}</div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Username: {{ card.username }}</li>
            <li class="list-group-item">Password: {{ card.password }}</li>
            <li class="list-group-item">Confirm: {{ card.confirmPassword }}</li>
            <li class="list-group-item">
              Resident: {{ card.isAustralian ? 'Yes' : 'No' }}
            </li>
            <li class="list-group-item">Gender: {{ card.gender }}</li>
            <li class="list-group-item">Reason: {{ card.reason }}</li>
            <li class="list-group-item">Suburb: {{ card.suburb }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: 'Segoe UI', sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.form-label {
  font-weight: 500;
}

.card-header {
  letter-spacing: 0.5px;
}

.list-group-item {
  font-size: 0.95rem;
}
.form-control:focus,
.form-select:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
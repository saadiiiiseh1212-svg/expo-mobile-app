import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { mockLogin, mockSignup } from '../data/users';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }) {
  const [mode, setMode] = useState('login');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFieldChange = (field, value) => {
    clearError(field);
    if (field === 'fullName') setFullName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
  };

  const validate = () => {
    const nextErrors = {};

    if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    const passwordOk = password.length >= 8 && /\d/.test(password);
    if (!passwordOk) {
      nextErrors.password = 'Password must be at least 8 characters and include a digit.';
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        nextErrors.fullName = 'Full name is required.';
      }
      if (confirmPassword !== password) {
        nextErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        const user = await mockLogin(email, password);
        routeAfterAuth(user);
      } else {
        const user = await mockSignup({ fullName, email, password, role });
        routeAfterAuth(user);
      }
    } catch (err) {
      Alert.alert('Authentication failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const routeAfterAuth = (user) => {
    if (user.role === 'manager') {
      navigation.replace('ManagerDashboard');
    } else {
      navigation.replace('Menu');
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'login'
            ? 'Log in to browse the menu and manage your orders.'
            : 'Sign up as a customer or restaurant manager.'}
        </Text>

        {mode === 'signup' && (
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              value={fullName}
              onChangeText={(v) => handleFieldChange('fullName', v)}
              placeholder="Ahmed Khan"
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={(v) => handleFieldChange('email', v)}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
              value={password}
              onChangeText={(v) => handleFieldChange('password', v)}
              placeholder="At least 8 chars, 1 digit"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
              <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {mode === 'signup' && (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                value={confirmPassword}
                onChangeText={(v) => handleFieldChange('confirmPassword', v)}
                placeholder="Re-enter password"
                secureTextEntry={!showPassword}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>I am a</Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[styles.roleButton, role === 'customer' && styles.roleButtonActive]}
                  onPress={() => setRole('customer')}
                >
                  <Text>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleButton, role === 'manager' && styles.roleButtonActive]}
                  onPress={() => setRole('manager')}
                >
                  <Text>Manager</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>
              {mode === 'login' ? 'Log In' : 'Sign Up'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={switchMode} style={styles.switchLink}>
          <Text style={styles.switchText}>
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Log in'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, marginBottom: 6, color: '#333', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  inputError: { borderColor: '#d33' },
  errorText: { color: '#d33', fontSize: 12, marginTop: 4 },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1 },
  toggleText: { marginLeft: 10, color: '#2a6fdb', fontWeight: '600' },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  roleButtonActive: { borderColor: '#2a6fdb', backgroundColor: '#e8f0fe' },
  submitButton: {
    backgroundColor: '#2a6fdb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  switchLink: { marginTop: 18, alignItems: 'center' },
  switchText: { color: '#2a6fdb', fontSize: 13 },
});
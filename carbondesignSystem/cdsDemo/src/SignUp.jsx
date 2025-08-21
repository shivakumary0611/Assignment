import React, { useState } from 'react'
import { TextInput, Button, PasswordInput, InlineNotification } from '@carbon/react';
import { CheckmarkFilled, WarningFilled, Renew } from '@carbon/icons-react';

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { label: "", color: "" };
    if (password.length < 6) return { label: "Weak", color: "red" };
    if (password.match(/[A-Z]/) && password.match(/[0-9]/))
      return { label: "Strong", color: "green" };
    return { label: "Medium", color: "orange" };
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
    } else {
      setErrors({});
      setSubmitted(true);
      console.log("Form Submitted ✅", form);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);

  // Helper for icon selection
  const renderStatusIcon = (fieldName) => {
    if (errors[fieldName]) return <WarningFilled style={{ fill: "red" }} />;
    if (form[fieldName]) return <CheckmarkFilled style={{ fill: "green" }} />;
    return <Renew style={{ fill: "gray" }} />;
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>Create Account</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
          <TextInput
            id="name"
            labelText="Name"
            placeholder='Enter your name'
            invalid={!!errors.name}
            invalidText={errors.name}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {renderStatusIcon("name")}
        </div>

        {/* Email */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
          <TextInput
            id='email'
            labelText="Email"
            placeholder='Enter your email'
            type='email'
            invalid={!!errors.email}
            invalidText={errors.email}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email ? (
            <WarningFilled style={{ fill: "red" }} />
          ) : /\S+@\S+\.\S+/.test(form.email) ? (
            <CheckmarkFilled style={{ fill: "green" }} />
          ) : (
            <Renew style={{ fill: "gray" }} />
          )}
        </div>

        {/* Password */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
          <PasswordInput
            id='password'
            labelText="Password"
            placeholder='Enter your new password'
            invalid={!!errors.password}
            invalidText={errors.password}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {renderStatusIcon("password")}
        </div>

        {/* Password strength */}
        {form.password && (
          <div style={{
            marginTop: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: "bold",
            color: passwordStrength.color,
          }}>
            Password strength: {passwordStrength.label}
          </div>
        )}

        {/* Confirm Password */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
          <PasswordInput
            id='confirmPassword'
            labelText="Confirm Password"
            placeholder='Re-enter your password'
            invalid={!!errors.confirmPassword}
            invalidText={errors.confirmPassword}
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
          {errors.confirmPassword ? (
            <WarningFilled style={{ fill: "red" }} />
          ) : form.confirmPassword && form.confirmPassword === form.password ? (
            <CheckmarkFilled style={{ fill: "green" }} />
          ) : (
            <Renew style={{ fill: "gray" }} />
          )}
        </div>

        <Button type="submit" kind="primary" style={{ marginTop: "1.5rem" }}>
          Sign Up
        </Button>
      </form>

      {/* Success / Error Notification */}
      {submitted && (
        <InlineNotification
          kind="success"
          title="Signup Successful!"
          subtitle="Welcome aboard 🎉"
          iconDescription="close"
          style={{ marginTop: "1rem" }}
        />
      )}
      {Object.keys(errors).length > 0 && !submitted && (
        <InlineNotification
          kind="error"
          title="Form has errors"
          subtitle="Please fix the issues above"
          iconDescription="close"
          style={{ marginTop: "1rem" }}
        />
      )}
    </div>
  );
}

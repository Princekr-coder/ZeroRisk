"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { InputField } from "@/components/auth/InputField";
import { cn } from "@/lib/utils";

export function ProfileForm({ initialData, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({ 
    name: initialData?.name || "", 
    email: initialData?.email || "" 
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name cannot be empty";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email formatting";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-card text-card-foreground shadow-sm rounded-2xl border border-border p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">Edit Profile</h3>
      <p className="text-sm text-muted-foreground mb-6">Update your account settings.</p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <InputField 
            label="Full Name" 
            id="name" 
            name="name"
            type="text" 
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField 
            label="Email Address" 
            id="email" 
            name="email"
            type="email" 
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            // Often emails are read-only or restricted, but user requested editable
          />
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium border border-transparent shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
              isLoading 
                ? "bg-primary/70 text-primary-foreground cursor-not-allowed" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

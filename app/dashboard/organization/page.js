"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { createOrganization } from "@/app/actions/organizations";

export default function CreateOrganizationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const res = await createOrganization(formData);
            if (res?.success) {
                toast.success("Organization created successfully!");
                router.push("/dashboard/recruiter");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to create organization");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-8 shadow-xl"
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Create Your Organization</h1>
                        <p className="text-text-secondary">Set up your company profile to start hiring.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Company Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g. Acme Corp"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        />
                    </div>

                    <div className="pt-4 border-t border-border flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
                                ${isLoading
                                    ? "bg-secondary text-white opacity-70 cursor-not-allowed"
                                    : "bg-primary hover:bg-secondary text-white hover:shadow-lg hover:shadow-primary/25 active:scale-95"
                                }
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    Create Organization
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

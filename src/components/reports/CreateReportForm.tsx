import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Camera,
  MapPin,
  Upload,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// Form validation schema
const formSchema = z.object({
  category: z.string().min(1, { message: "Please select a category" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  location: z
    .string()
    .min(5, { message: "Location must be at least 5 characters" }),
  barangay: z.string().min(1, { message: "Please select your barangay" }),
  contactName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  contactPhone: z
    .string()
    .min(10, { message: "Please enter a valid phone number" }),
  contactEmail: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional(),
});

interface CreateReportFormProps {
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
}

const CreateReportForm: React.FC<CreateReportFormProps> = ({
  onSubmit = (data) => console.log("Form submitted:", data),
  isLoading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      description: "",
      location: "",
      barangay: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file),
      );
      setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = [...uploadedPhotos];
    updatedPhotos.splice(index, 1);
    setUploadedPhotos(updatedPhotos);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      // Include photos with the form data
      const formData = {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        barangay: data.barangay,
        contact_name: data.contactName,
        contact_phone: data.contactPhone,
        contact_email: data.contactEmail,
        reporter_id: 1, // Default to first user for demo
        images: uploadedPhotos,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
      };

      // Call the API to create a new report
      const response = await fetch("http://localhost/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Pass the result to the parent component
        onSubmit({ ...data, id: result.id, photos: uploadedPhotos } as z.infer<
          typeof formSchema
        >);
        alert("Report submitted successfully!");
      } else {
        console.error("Failed to submit report:", result.error);
        alert("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert(
        "Error submitting report. Please check your connection and try again.",
      );
    }
  });

  const steps = [
    { id: "category", label: "Category" },
    { id: "details", label: "Details" },
    { id: "photos", label: "Photos" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Report an Issue
        </CardTitle>
        <CardDescription className="text-center">
          Help us improve our community by reporting issues you've encountered.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-2">{step.label}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-muted w-full"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-primary transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Category Selection */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="roads">Road Damage</SelectItem>
                          <SelectItem value="drainage">
                            Drainage Issues
                          </SelectItem>
                          <SelectItem value="electricity">
                            Electrical Problems
                          </SelectItem>
                          <SelectItem value="water">Water Supply</SelectItem>
                          <SelectItem value="waste">
                            Waste Management
                          </SelectItem>
                          <SelectItem value="public_property">
                            Public Property Damage
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the category that best describes the issue.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief title of the issue"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a short, descriptive title for the issue.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Issue Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the issue in detail"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide as much detail as possible about the issue.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter the location of the issue"
                            {...field}
                          />
                          <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Specify where the issue is located (street address,
                        landmarks, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="barangay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barangay</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your barangay" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Barangay 1">Barangay 1</SelectItem>
                          <SelectItem value="Barangay 2">Barangay 2</SelectItem>
                          <SelectItem value="Barangay 3">Barangay 3</SelectItem>
                          <SelectItem value="Barangay 4">Barangay 4</SelectItem>
                          <SelectItem value="Barangay 5">Barangay 5</SelectItem>
                          <SelectItem value="Barangay 6">Barangay 6</SelectItem>
                          <SelectItem value="Barangay 7">Barangay 7</SelectItem>
                          <SelectItem value="Barangay 8">Barangay 8</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the barangay where the issue is located
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Photo Upload */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Upload Photos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add photos to help us better understand the issue.
                    <br />
                    You can upload up to 5 photos.
                  </p>
                  <div className="flex justify-center">
                    <label htmlFor="photo-upload">
                      <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Select Photos</span>
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={uploadedPhotos.length >= 5}
                      />
                    </label>
                  </div>
                </div>

                {uploadedPhotos.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">
                      Uploaded Photos ({uploadedPhotos.length}/5)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {uploadedPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Uploaded photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        We may contact you for additional information.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email address"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        We'll send you updates about your report.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Navigation buttons */}
            <CardFooter className="flex justify-between px-0">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Report"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateReportForm;

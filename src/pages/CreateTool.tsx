import React, { useState } from 'react';
import type { ToolCategory, ToolTag } from '../types';
import SelectablePill from '../components/ui/SelectablePill';

type FormState = {
  toolName: string;
  shortDescription: string;
  fullDetails: string;
  toolImage: string;
  descriptionLink: string;
  website: string;
  telegram: string;
  twitter: string;
};

const CATEGORY_OPTIONS: ToolCategory[] = [
  'Data Analytics',
  'AI Tools',
  'Development',
  'Design',
  'Marketing',
  'Productivity',
  'Social Media',
  'Content Creation',
  'E-commerce',
  'Other',
];

const TAG_OPTIONS: ToolTag[] = [
  'Free',
  'Paid',
  'Open Source',
  'Web-based',
  'Desktop',
  'Mobile',
  'API',
  'Plugin',
  'No Signup',
  'Cloud',
  'Self-hosted',
  'AI Powered',
];

const SOCIAL_FIELDS: ReadonlyArray<{ label: string; name: keyof FormState; placeholder: string; }> = [
  { label: 'Website', name: 'website', placeholder: 'https://example.com' },
  { label: 'Telegram', name: 'telegram', placeholder: '@username or https://t.me/username' },
  { label: 'Twitter / X', name: 'twitter', placeholder: '@username or https://twitter.com/username' },
];

type SocialFieldKey = (typeof SOCIAL_FIELDS)[number]['name'];

const inputClassNames = 'mt-2 w-full rounded-md border border-border-color dark:bg-secondary-bg px-3 py-2 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-primary-color';

const CreateToolPage = () => {
  const [formData, setFormData] = useState<FormState>({
    toolName: '',
    shortDescription: '',
    fullDetails: '',
    toolImage: '',
    descriptionLink: '',
    website: '',
    telegram: '',
    twitter: '',
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const updateField = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    updateField(name as keyof FormState, value);
  };

    const toggleOption = (value: string, listSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
        listSetter((prev) => {
            if(prev.includes(value))
                return prev.filter((item) => item !== value)
            else
                return [...prev, value]
        }
        );
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Placeholder submit handler – integrate with backend or mutation as needed.
        const payload = {
            ...formData,
            tags: selectedTags,
            categories: selectedCategories,
            socialLinks: SOCIAL_FIELDS.map(({ name }) => ({
            label: name,
            url: formData[name as SocialFieldKey],
        })),
        };
        console.log('Submit payload:', payload);
    };

    return (
        <section className="flex flex-col">
            <header 
                className="text-primary-color text-2xl font-bold"
            >Add New Tool</header>
            <p 
                className="text-secondary-color mb-8"
            >
                Fill in the details to submit a new tool.
            </p>

            <form
              onSubmit={handleSubmit}
              className="gap-4 flex flex-col text-primary-color bg-primary-bg px-4 lg:px-8 py-8 rounded-2xl
                [&_label]:text-primary-color [&_label]:font-medium [&_.hint]:text-secondary-color 
                [&_.hint]:text-xs"
            >
                <div className="flex flex-col">
                    <label>Tool Name *</label>
                    <input
                        name="toolName"
                        value={formData.toolName}
                        onChange={handleInputChange}
                        className={inputClassNames}
                        placeholder="Enter tool name"
                        required
                    />
                </div>

            <div className="flex flex-col gap-3">
                <label>Categories *</label>
                <div className="flex gap-2 flex-wrap">
                    {
                        CATEGORY_OPTIONS.map((category) => (
                            <SelectablePill
                                key={category}
                                label={category}
                                selected={selectedCategories.includes(category)}
                                onToggle={() => toggleOption(category, setSelectedCategories)}
                            />
                        ))
                    }
                </div>
            </div>

            <div className="flex flex-col">
                <label>Short Description *</label>
                <textarea
                    name="shortDescription"
                    maxLength={140}
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    className={`${inputClassNames} min-h-[60px] resize-none`}
                    placeholder="Brief description of the tool."
                />
            </div>

            <div className="flex flex-col">
                <label>Full Details *</label>
                <textarea
                    name="fullDetails"
                    value={formData.fullDetails}
                    onChange={handleInputChange}
                    className={`${inputClassNames} min-h-[120px] resize-none`}
                    placeholder="Explain the features, pricing, and use cases."
                />
            </div>

            <div className="flex flex-col">
                <label>Tool Image URL *</label>
                <input
                    name="toolImage"
                    value={formData.toolImage}
                    onChange={handleInputChange}
                    className={inputClassNames}
                    placeholder="https://example.com/image.png"
                />
            </div>

            <div className="gap-3 flex flex-col">
                <label>Tags</label>
                <div className="flex flex-wrap gap-2">
                {
                    TAG_OPTIONS.map((tag) => (
                        <SelectablePill
                            key={tag}
                            label={tag}
                            selected={selectedTags.includes(tag)}
                            onToggle={() => toggleOption(tag, setSelectedTags)}
                        />
                    ))
                }
                </div>
            </div>

            <div className="flex flex-col">
                <label>Social Links (optional)</label>
                <div className="mt-3 grid gap-2">
                    {
                        SOCIAL_FIELDS.map(({ label, name, placeholder }) => {
                            const typedName = name as SocialFieldKey;

                            return (
                                <div key={name}>
                                    <label className="hint">{label}</label>
                                    <input
                                        name={name}
                                        value={formData[typedName]}
                                        onChange={handleInputChange}
                                        className={inputClassNames}
                                        placeholder={placeholder}
                                    />
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            <button
                type="submit"
                className="mt-5 w-full! rounded-md! bg-main-color! text-center text-base font-extrabold! text-black-color!"
            >Submit Tool</button>
            </form>
        </section>
    );
};

export default CreateToolPage;
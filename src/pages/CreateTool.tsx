import React from 'react';
import { useTools } from '../context/ToolsProvider';
import type { ToolCategory, ToolTag } from '../types';
import AttachImages from '../components/ui/AttachImages';
import SelectablePill from '../components/ui/SelectablePill';

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

const SOCIAL_FIELDS: ReadonlyArray<{ label: string; name: 'telegram' | 'x' | 'website'; placeholder: string; }> = [
  { label: 'Telegram', name: 'telegram', placeholder: '@username or https://t.me/username' },
  { label: 'Twitter / X', name: 'x', placeholder: '@username or https://twitter.com/username' },
  { label: 'Website', name: 'website', placeholder: 'https://example.com' },
];

const inputClassNames = 'mt-2 w-full rounded-md border border-border-color dark:bg-secondary-bg px-3 py-2 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-primary-color';

const CreateToolPage = () => {
  const { state, send } = useTools();

  const formData = state.context.newTool;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        send({ type: "CHANGE_FIELD", field: name as keyof typeof formData, value });
    };

    const handleToggleCategory = (category: ToolCategory) => {
        // Category is single value - toggle: if same category selected, clear it; otherwise select new one
        const newCategory = formData.category === category ? '' : category;
        send({ type: "CHANGE_FIELD", field: "category", value: newCategory });
    };

    const handleToggleTag = (tag: ToolTag) => {
        // Tags is array - toggle: add if not present, remove if present
        const currentTags = formData.tags || [];
        const newTags = currentTags.includes(tag)
            ? currentTags.filter((t) => t !== tag)
            : [...currentTags, tag];
        send({ type: "CHANGE_FIELD", field: "tags", value: newTags });
    };

    const handleChangeImages = (nextImages: string[]) => {
        send({ type: "CHANGE_FIELD", field: "toolImages", value: nextImages });
    }

    const handleSocialLinkChange = (field: 'telegram' | 'x' | 'website', value: string) => {
        send({ 
            type: "CHANGE_FIELD", 
            field: "links", 
            value: {
                ...formData.links,
                [field]: value,
            }
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        send({ type: "SUBMIT_TOOL" });
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
                        name="name"
                        value={formData.name}
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
                                selected={formData.category === category}
                                onToggle={() => handleToggleCategory(category)}
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
                    name="fullDetail"
                    value={formData.fullDetail}
                    onChange={handleInputChange}
                    className={`${inputClassNames} min-h-[120px] resize-none`}
                    placeholder="Explain the features, pricing, and use cases."
                />
            </div>

            <AttachImages
                images={state.context.newTool.toolImages || []}
                label={"Tool Images *"}
                onChange={handleChangeImages}
            />

            <div className="gap-3 flex flex-col">
                <label>Tags</label>
                <div className="flex flex-wrap gap-2">
                {
                    TAG_OPTIONS.map((tag) => (
                        <SelectablePill
                            key={tag}
                            label={tag}
                            selected={formData.tags?.includes(tag) || false}
                            onToggle={() => handleToggleTag(tag)}
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
                            return (
                                <div key={name}>
                                    <label className="hint">{label}</label>
                                    <input
                                        name={name}
                                        value={formData.links?.[name] || ''}
                                        onChange={(e) => handleSocialLinkChange(name, e.target.value)}
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
                className="mt-5 w-full! lg:w-md! mx-auto rounded-md! bg-main-color! text-center text-base font-extrabold! text-black-color!"
            >Submit Tool</button>
            </form>
        </section>
    );
};

export default CreateToolPage;
export interface CourseInfo {
    courseName: string;
    startDate: string;
    duration: string;
    learningMode: 'online' | 'offline' | 'hybrid';
    keyHighlights: string[];
    registrationLink: string;
    relatedHashtags: string[];
}

export interface ChannelStyle {
    id: string;
    name: string;
    description: string;
    characteristics: string[];
}

export interface TemplateStyle {
    id: string;
    name: string;
    description: string;
    structure: string;
}

export interface ExtraOptions {
    contentLength: 'short' | 'medium' | 'detailed';
    withEmojis: boolean;
    urgencyToggle: boolean;
}

export interface SidebarItem {
    id: string;
    title: string;
    createdAt: string;
    type: 'course' | 'event';
    data?: Record<string, unknown>;
}

export interface EventInfo {
    name: string;
    time: string;
    location: string;
    highlights: string[];
    audience: string;
    offers: string[];
    registrationLink: string;
}

export interface EventTemplate {
    id: string;
    name: string;
    description: string;
    structure: string;
}

export interface PromptConfig {
    courseInfo: CourseInfo;
    channelStyle: ChannelStyle;
    templateStyle: TemplateStyle;
    extraOptions: ExtraOptions;
}

export interface EventPromptConfig {
    eventInfo: EventInfo;
    channelStyle: ChannelStyle;
    templateStyle: EventTemplate;
    extraOptions: ExtraOptions;
}

// Types for complete saved data (including extra options)
export interface CompleteCourseData {
    courseInfo: CourseInfo;
    selectedChannel: ChannelStyle | null;
    selectedTemplate: TemplateStyle | null;
    extraOptions: ExtraOptions;
}

export interface CompleteEventData {
    eventInfo: EventInfo;
    selectedChannel: ChannelStyle | null;
    selectedTemplate: EventTemplate | null;
    extraOptions: ExtraOptions;
}
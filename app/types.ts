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

export interface PromptConfig {
  courseInfo: CourseInfo;
  channelStyle: ChannelStyle;
  templateStyle: TemplateStyle;
  extraOptions: ExtraOptions;
}
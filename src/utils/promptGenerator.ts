import type { PromptConfig, EventPromptConfig } from '@/lib/types';

export function generatePrompt(config: PromptConfig): string {
    const { courseInfo, channelStyle, templateStyle, extraOptions } = config;

    // Build the main prompt structure
    let prompt = `You are an expert marketing copywriter for CUSC (Trung tâm Công nghệ Phần mềm Đại học Cần Thơ). 

STRICT REQUIREMENTS:
- Always use the exact organization name: "Trung tâm Công nghệ Phần mềm Đại học Cần Thơ (CUSC)"
- Never abbreviate, misspell, or alter this name
- Always end with hashtags including #CUSC
- Ensure perfect spelling and grammar throughout
- Follow the specified tone and format exactly

COURSE DETAILS:
- Course Name: ${courseInfo.courseName}
- Start Date: ${courseInfo.startDate}
- Duration: ${courseInfo.duration}
- Learning Mode: ${courseInfo.learningMode}
- Registration Link: ${courseInfo.registrationLink}`;

    // Add key highlights
    if (courseInfo.keyHighlights.length > 0) {
        prompt += `\n- Key Highlights:\n${courseInfo.keyHighlights.map(highlight => `  • ${highlight}`).join('\n')}`;
    }

    // Add channel-specific instructions
    prompt += `\n\nCHANNEL STYLE - ${channelStyle.name.toUpperCase()}:
${channelStyle.characteristics.map(char => `- ${char}`).join('\n')}`;

    // Add template-specific instructions
    prompt += `\n\nTEMPLATE STYLE - ${templateStyle.name.toUpperCase()}:
${templateStyle.description}
Structure: ${templateStyle.structure}`;

    // Add content length instructions
    const lengthInstructions = {
        short: 'Keep the content concise (50-100 words)',
        medium: 'Create medium-length content (100-200 words)',
        detailed: 'Develop detailed content (200-300 words)'
    };

    prompt += `\n\nCONTENT LENGTH: ${lengthInstructions[extraOptions.contentLength]}`;

    // Add emoji instructions
    if (extraOptions.withEmojis) {
        prompt += `\nEMOJIS: Include relevant emojis to make the content more engaging`;
    } else {
        prompt += `\nEMOJIS: Do not use emojis in this content`;
    }

    // Add urgency instructions
    if (extraOptions.urgencyToggle) {
        prompt += `\nURGENCY: Emphasize limited seats or registration deadline to create urgency`;
    }

    // Add hashtag requirements
    const allHashtags = ['#CUSC', ...courseInfo.relatedHashtags];
    prompt += `\n\nHASHTAGS REQUIREMENT:
Always end the post with these hashtags: ${allHashtags.join(' ')}`;

    // Add final instructions based on channel
    if (channelStyle.id === 'main-fanpage') {
        prompt += `\n\nADDITIONAL REQUIREMENTS:
- Include CUSC contact hotline in the post
- Maintain professional and authoritative tone
- Provide comprehensive course information`;
    } else if (channelStyle.id === 'community-group') {
        prompt += `\n\nADDITIONAL REQUIREMENTS:
- Encourage questions and comments
- Use conversational and friendly language
- Create content that sparks community discussion`;
    } else if (channelStyle.id === 'zalo-oa') {
        prompt += `\n\nADDITIONAL REQUIREMENTS:
- Create a compelling headline
- Include strong, immediate call-to-action
- Keep format mobile-friendly and scannable`;
    } else if (channelStyle.id === 'email-marketing') {
        prompt += `\n\nADDITIONAL REQUIREMENTS:
- Start with personalized greeting
- Use email-appropriate format with subject line suggestion
- Include clear next steps for recipients`;
    }

    prompt += `\n\nNow create the marketing content following all the above requirements.`;

    return prompt;
}

export function generateEventPrompt(config: EventPromptConfig): string {
    const { eventInfo, channelStyle, templateStyle, extraOptions } = config;

    // Build the main prompt structure
    let prompt = `You are an expert marketing copywriter for CUSC (Trung tâm Công nghệ Phần mềm Đại học Cần Thơ). 

STRICT REQUIREMENTS:
- Always use the exact organization name: "Trung tâm Công nghệ Phần mềm Đại học Cần Thơ (CUSC)"
- Never abbreviate, misspell, or alter this name
- Always end with hashtags including #CUSC
- Ensure perfect spelling and grammar throughout
- Follow the specified tone and format exactly

EVENT DETAILS:
- Event Name: ${eventInfo.name}
- Date & Time: ${eventInfo.time}
- Location: ${eventInfo.location}
- Target Audience: ${eventInfo.audience}
- Registration Link: ${eventInfo.registrationLink}`;

    // Add highlights
    if (eventInfo.highlights.length > 0) {
        prompt += `\n- Key Highlights/Agenda:\n${eventInfo.highlights.map(highlight => `  • ${highlight}`).join('\n')}`;
    }

    // Add offers
    if (eventInfo.offers.length > 0) {
        prompt += `\n- Special Offers/Benefits:\n${eventInfo.offers.map(offer => `  • ${offer}`).join('\n')}`;
    }

    // Add channel-specific instructions
    prompt += `\n\nCHANNEL STYLE - ${channelStyle.name.toUpperCase()}:
${channelStyle.characteristics.map(char => `- ${char}`).join('\n')}`;

    // Add template-specific instructions
    prompt += `\n\nTEMPLATE STYLE - ${templateStyle.name.toUpperCase()}:
${templateStyle.description}
Structure: ${templateStyle.structure}`;

    // Add content length instructions
    const lengthInstructions = {
        short: 'Keep the content concise (50-100 words)',
        medium: 'Create medium-length content (100-200 words)',
        detailed: 'Develop detailed content (200-300 words)'
    };

    prompt += `\n\nCONTENT LENGTH: ${lengthInstructions[extraOptions.contentLength]}`;

    // Add emoji instructions
    if (extraOptions.withEmojis) {
        prompt += `\nEMOJIS: Include relevant emojis to make the content more engaging`;
    } else {
        prompt += `\nEMOJIS: Do not use emojis in this content`;
    }

    // Add urgency instructions
    if (extraOptions.urgencyToggle) {
        prompt += `\nURGENCY: Emphasize limited seats or registration deadline to create urgency`;
    }

    // Add hashtag requirements
    prompt += `\n\nHASHTAGS REQUIREMENT:
Always end the post with hashtags including #CUSC and relevant event hashtags`;

    // Add final instructions based on channel
    if (channelStyle.id === 'main-fanpage') {
        prompt += `\n\nADDITIONAL REQUIREMENTS:
- Include CUSC contact hotline in the post
- Maintain professional and authoritative tone
- Provide comprehensive event information`;
    } else if (channelStyle.id === 'community-group') {
        prompt += `\n\nADDITIONAL REQUIREMENTS:
- Encourage questions and comments about the event
- Use conversational and friendly language
- Create content that sparks community discussion`;
    } else if (channelStyle.id === 'zalo-oa') {
        prompt += `\n\nADDITIONAL REQUIREMENTS:
- Create a compelling headline
- Include strong, immediate call-to-action
- Keep format mobile-friendly and scannable`;
    } else if (channelStyle.id === 'email-marketing') {
        prompt += `\n\nADDITIONAL REQUIREMENTS:
- Start with personalized greeting
- Use email-appropriate format with subject line suggestion
- Include clear next steps for recipients`;
    }

    prompt += `\n\nNow create the event marketing content following all the above requirements.`;

    return prompt;
}
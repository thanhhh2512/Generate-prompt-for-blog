import React, { useState } from 'react';
import { Copy, Settings, FileText, Zap } from 'lucide-react';
import { CourseInfo, ChannelStyle, TemplateStyle, ExtraOptions, PromptConfig } from './types';
import { channels } from './data/channels';
import { templates } from './data/templates';
import { generatePrompt } from './utils/promptGenerator';

function App() {
  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    courseName: '',
    startDate: '',
    duration: '',
    learningMode: 'online',
    keyHighlights: [''],
    registrationLink: '',
    relatedHashtags: ['']
  });

  const [selectedChannel, setSelectedChannel] = useState<ChannelStyle | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle | null>(null);
  const [extraOptions, setExtraOptions] = useState<ExtraOptions>({
    contentLength: 'medium',
    withEmojis: true,
    urgencyToggle: false
  });

  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCourseInfoChange = (field: keyof CourseInfo, value: any) => {
    setCourseInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'keyHighlights' | 'relatedHashtags', index: number, value: string) => {
    setCourseInfo(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'keyHighlights' | 'relatedHashtags') => {
    setCourseInfo(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'keyHighlights' | 'relatedHashtags', index: number) => {
    setCourseInfo(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const generateContent = () => {
    if (!selectedChannel || !selectedTemplate) {
      alert('Vui lòng chọn kênh truyền thông và mẫu nội dung!');
      return;
    }

    const config: PromptConfig = {
      courseInfo: {
        ...courseInfo,
        keyHighlights: courseInfo.keyHighlights.filter(h => h.trim() !== ''),
        relatedHashtags: courseInfo.relatedHashtags.filter(h => h.trim() !== '')
      },
      channelStyle: selectedChannel,
      templateStyle: selectedTemplate,
      extraOptions
    };

    const prompt = generatePrompt(config);
    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            CUSC Prompt Generator
          </h1>
          <p className="text-gray-600">
            Tạo nội dung marketing chuyên nghiệp cho Trung tâm Công nghệ Phần mềm Đại học Cần Thơ
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            {/* Course Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="mr-2" size={20} />
                Thông tin khóa học
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên khóa học *
                  </label>
                  <input
                    type="text"
                    value={courseInfo.courseName}
                    onChange={(e) => handleCourseInfoChange('courseName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Khóa học lập trình Python căn bản"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày khai giảng *
                    </label>
                    <input
                      type="text"
                      value={courseInfo.startDate}
                      onChange={(e) => handleCourseInfoChange('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: 15/01/2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời lượng *
                    </label>
                    <input
                      type="text"
                      value={courseInfo.duration}
                      onChange={(e) => handleCourseInfoChange('duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: 3 tháng"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình thức học *
                  </label>
                  <select
                    value={courseInfo.learningMode}
                    onChange={(e) => handleCourseInfoChange('learningMode', e.target.value as 'online' | 'offline' | 'hybrid')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Điểm nổi bật
                  </label>
                  {courseInfo.keyHighlights.map((highlight, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => handleArrayChange('keyHighlights', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="VD: Học với chuyên gia giàu kinh nghiệm"
                      />
                      {courseInfo.keyHighlights.length > 1 && (
                        <button
                          onClick={() => removeArrayItem('keyHighlights', index)}
                          className="ml-2 px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('keyHighlights')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Thêm điểm nổi bật
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link đăng ký *
                  </label>
                  <input
                    type="url"
                    value={courseInfo.registrationLink}
                    onChange={(e) => handleCourseInfoChange('registrationLink', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://cusc.ctu.edu.vn/dang-ky"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hashtags liên quan
                  </label>
                  {courseInfo.relatedHashtags.map((hashtag, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={hashtag}
                        onChange={(e) => handleArrayChange('relatedHashtags', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="VD: #Python #Programming"
                      />
                      {courseInfo.relatedHashtags.length > 1 && (
                        <button
                          onClick={() => removeArrayItem('relatedHashtags', index)}
                          className="ml-2 px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('relatedHashtags')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Thêm hashtag
                  </button>
                </div>
              </div>
            </div>

            {/* Channel Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Chọn kênh truyền thông *
              </h2>
              <div className="grid gap-3">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedChannel?.id === channel.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-800">{channel.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Chọn mẫu nội dung *
              </h2>
              <div className="grid gap-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-800">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Extra Options */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Settings className="mr-2" size={20} />
                Tùy chọn bổ sung
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ dài nội dung
                  </label>
                  <select
                    value={extraOptions.contentLength}
                    onChange={(e) => setExtraOptions(prev => ({ ...prev, contentLength: e.target.value as 'short' | 'medium' | 'detailed' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="short">Ngắn gọn (50-100 từ)</option>
                    <option value="medium">Trung bình (100-200 từ)</option>
                    <option value="detailed">Chi tiết (200-300 từ)</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emojis"
                    checked={extraOptions.withEmojis}
                    onChange={(e) => setExtraOptions(prev => ({ ...prev, withEmojis: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="emojis" className="text-sm text-gray-700">
                    Sử dụng emoji
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="urgency"
                    checked={extraOptions.urgencyToggle}
                    onChange={(e) => setExtraOptions(prev => ({ ...prev, urgencyToggle: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="urgency" className="text-sm text-gray-700">
                    Tạo tính cấp thiết
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateContent}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Zap className="mr-2" size={20} />
              Tạo Prompt
            </button>
          </div>

          {/* Right Panel - Generated Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Prompt được tạo
              </h2>
              {generatedPrompt && (
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    copied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Copy className="mr-1" size={16} />
                  {copied ? 'Đã sao chép!' : 'Sao chép'}
                </button>
              )}
            </div>

            {generatedPrompt ? (
              <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {generatedPrompt}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 h-96 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Điền thông tin và nhấn "Tạo Prompt" để tạo nội dung marketing
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
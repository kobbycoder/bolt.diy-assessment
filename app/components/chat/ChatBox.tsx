import React from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';
import { ModelSelector } from '~/components/chat/ModelSelector';
import { APIKeyManager } from './APIKeyManager';
import { LOCAL_PROVIDERS } from '~/lib/stores/settings';
import FilePreview from './FilePreview';
import { ScreenshotStateManager } from './ScreenshotStateManager';
import { SendButton } from './SendButton.client';
import { IconButton } from '~/components/ui/IconButton';
import { toast } from 'react-toastify';
import { SpeechRecognitionButton } from '~/components/chat/SpeechRecognition';
import { SupabaseConnection } from './SupabaseConnection';
import { ExpoQrModal } from '~/components/workbench/ExpoQrModal';
import styles from './BaseChat.module.scss';
import type { ProviderInfo } from '~/types/model';
import { ColorSchemeDialog } from '~/components/ui/ColorSchemeDialog';
import type { DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';
import { McpTools } from './MCPTools';

interface ChatBoxProps {
  isModelSettingsCollapsed: boolean;
  setIsModelSettingsCollapsed: (collapsed: boolean) => void;
  provider: any;
  providerList: any[];
  modelList: any[];
  apiKeys: Record<string, string>;
  isModelLoading: string | undefined;
  onApiKeysChange: (providerName: string, apiKey: string) => void;
  uploadedFiles: File[];
  imageDataList: string[];
  textareaRef: React.RefObject<HTMLTextAreaElement> | undefined;
  input: string;
  handlePaste: (e: React.ClipboardEvent) => void;
  TEXTAREA_MIN_HEIGHT: number;
  TEXTAREA_MAX_HEIGHT: number;
  isStreaming: boolean;
  handleSendMessage: (event: React.UIEvent, messageInput?: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  chatStarted: boolean;
  exportChat?: () => void;
  qrModalOpen: boolean;
  setQrModalOpen: (open: boolean) => void;
  handleFileUpload: () => void;
  setProvider?: ((provider: ProviderInfo) => void) | undefined;
  model?: string | undefined;
  setModel?: ((model: string) => void) | undefined;
  setUploadedFiles?: ((files: File[]) => void) | undefined;
  setImageDataList?: ((dataList: string[]) => void) | undefined;
  handleInputChange?: ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | undefined;
  handleStop?: (() => void) | undefined;
  enhancingPrompt?: boolean | undefined;
  enhancePrompt?: (() => void) | undefined;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: ((element: ElementInfo | null) => void) | undefined;
}

export const ChatBox: React.FC<ChatBoxProps> = (props) => {
  return (
    <div
      className={classNames(
        'relative bg-bolt-elements-background-depth-2 backdrop-blur-sm p-4 rounded-xl border border-bolt-elements-borderColor/60 w-full max-w-chat mx-auto z-prompt',
        'shadow-lg shadow-bolt-elements-background-depth-1/20',
        'transition-all duration-300 ease-out',
        'hover:border-bolt-elements-borderColor/80 hover:shadow-xl hover:shadow-bolt-elements-background-depth-1/30',
      )}
    >
      {/* Enhanced visual effects */}
      <svg className={classNames(styles.PromptEffectContainer)}>
        <defs>
          <linearGradient
            id="line-gradient"
            x1="20%"
            y1="0%"
            x2="-14%"
            y2="10%"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(-45)"
          >
            <stop offset="0%" stopColor="#b44aff" stopOpacity="0%"></stop>
            <stop offset="40%" stopColor="#b44aff" stopOpacity="80%"></stop>
            <stop offset="50%" stopColor="#b44aff" stopOpacity="80%"></stop>
            <stop offset="100%" stopColor="#b44aff" stopOpacity="0%"></stop>
          </linearGradient>
          <linearGradient id="shine-gradient">
            <stop offset="0%" stopColor="white" stopOpacity="0%"></stop>
            <stop offset="40%" stopColor="#ffffff" stopOpacity="80%"></stop>
            <stop offset="50%" stopColor="#ffffff" stopOpacity="80%"></stop>
            <stop offset="100%" stopColor="white" stopOpacity="0%"></stop>
          </linearGradient>
        </defs>
        <rect className={classNames(styles.PromptEffectLine)} pathLength="100" strokeLinecap="round"></rect>
        <rect className={classNames(styles.PromptShine)} x="48" y="24" width="70" height="1"></rect>
      </svg>

      {/* Model Settings Section */}
      <div className="mb-4">
        <ClientOnly>
          {() => (
            <div
              className={classNames(
                'transition-all duration-300 ease-in-out overflow-hidden',
                props.isModelSettingsCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100',
              )}
            >
              <div className="space-y-3">
                <ModelSelector
                  key={props.provider?.name + ':' + props.modelList.length}
                  model={props.model}
                  setModel={props.setModel}
                  modelList={props.modelList}
                  provider={props.provider}
                  setProvider={props.setProvider}
                  providerList={props.providerList || (PROVIDER_LIST as ProviderInfo[])}
                  apiKeys={props.apiKeys}
                  modelLoading={props.isModelLoading}
                />
                {(props.providerList || []).length > 0 &&
                  props.provider &&
                  (!LOCAL_PROVIDERS.includes(props.provider.name) || 'OpenAILike') && (
                    <APIKeyManager
                      provider={props.provider}
                      apiKey={props.apiKeys[props.provider.name] || ''}
                      setApiKey={(key) => {
                        props.onApiKeysChange(props.provider.name, key);
                      }}
                    />
                  )}
              </div>
            </div>
          )}
        </ClientOnly>
      </div>

      {/* File Preview Section */}
      <div className="mb-3">
        <FilePreview
          files={props.uploadedFiles}
          imageDataList={props.imageDataList}
          onRemove={(index) => {
            props.setUploadedFiles?.(props.uploadedFiles.filter((_, i) => i !== index));
            props.setImageDataList?.(props.imageDataList.filter((_, i) => i !== index));
          }}
        />
      </div>

      {/* Screenshot State Manager */}
      <ClientOnly>
        {() => (
          <ScreenshotStateManager
            setUploadedFiles={props.setUploadedFiles}
            setImageDataList={props.setImageDataList}
            uploadedFiles={props.uploadedFiles}
            imageDataList={props.imageDataList}
          />
        )}
      </ClientOnly>

      {/* Selected Element Indicator */}
      {props.selectedElement && (
        <div className="flex mx-1 gap-3 items-center justify-between rounded-lg rounded-b-none border border-b-none border-bolt-elements-borderColor/60 text-bolt-elements-textPrimary py-2 px-3 font-medium text-xs bg-bolt-elements-background-depth-1/50 backdrop-blur-sm">
          <div className="flex gap-2 items-center">
            <code className="bg-accent-500/90 rounded-md px-2 py-1 text-white font-mono text-xs shadow-sm">
              {props?.selectedElement?.tagName}
            </code>
            <span className="text-bolt-elements-textSecondary">selected for inspection</span>
          </div>
          <button
            className="bg-transparent text-accent-500 hover:text-accent-400 transition-colors duration-200 text-xs font-medium px-2 py-1 rounded-md hover:bg-accent-500/10"
            onClick={() => props.setSelectedElement?.(null)}
          >
            Clear
          </button>
        </div>
      )}

      {/* Main Input Container */}
      <div
        className={classNames(
          'relative shadow-sm border border-bolt-elements-borderColor/60 backdrop-blur-sm rounded-xl',
          'transition-all duration-200 ease-out',
          'hover:border-bolt-elements-borderColor/80 hover:shadow-md',
          'focus-within:border-accent-500/60 focus-within:shadow-lg focus-within:shadow-accent-500/20',
        )}
      >
        <textarea
          ref={props.textareaRef}
          className={classNames(
            'w-full pl-4 pt-4 pr-16 pb-4 outline-none resize-none rounded-lg',
            'text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent text-sm',
            'transition-all duration-200 ease-out',
            'focus:placeholder-bolt-elements-textSecondary',
            'font-sans leading-relaxed',
          )}
          onDragEnter={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = '2px solid #1488fc';
            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(20, 136, 252, 0.1)';
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = '2px solid #1488fc';
            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(20, 136, 252, 0.1)';
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = '1px solid var(--bolt-elements-borderColor)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = '1px solid var(--bolt-elements-borderColor)';
            e.currentTarget.style.boxShadow = 'none';

            const files = Array.from(e.dataTransfer.files);
            files.forEach((file) => {
              if (file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onload = (e) => {
                  const base64Image = e.target?.result as string;
                  props.setUploadedFiles?.([...props.uploadedFiles, file]);
                  props.setImageDataList?.([...props.imageDataList, base64Image]);
                };
                reader.readAsDataURL(file);
              }
            });
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              if (event.shiftKey) {
                return;
              }

              event.preventDefault();

              if (props.isStreaming) {
                props.handleStop?.();
                return;
              }

              // ignore if using input method engine
              if (event.nativeEvent.isComposing) {
                return;
              }

              props.handleSendMessage?.(event);
            }
          }}
          value={props.input}
          onChange={(event) => {
            props.handleInputChange?.(event);
          }}
          onPaste={props.handlePaste}
          style={{
            minHeight: props.TEXTAREA_MIN_HEIGHT,
            maxHeight: props.TEXTAREA_MAX_HEIGHT,
          }}
          placeholder={props.chatMode === 'build' ? 'How can Bolt help you today?' : 'What would you like to discuss?'}
          translate="no"
        />

        {/* Send Button */}
        <ClientOnly>
          {() => (
            <SendButton
              show={props.input.length > 0 || props.isStreaming || props.uploadedFiles.length > 0}
              isStreaming={props.isStreaming}
              disabled={!props.providerList || props.providerList.length === 0}
              onClick={(event) => {
                if (props.isStreaming) {
                  props.handleStop?.();
                  return;
                }

                if (props.input.length > 0 || props.uploadedFiles.length > 0) {
                  props.handleSendMessage?.(event);
                }
              }}
            />
          )}
        </ClientOnly>

        {/* Bottom Toolbar */}
        <div className="flex justify-between items-center text-sm p-4 pt-2 border-t border-bolt-elements-borderColor/30 bg-bolt-elements-background-depth-1/20 rounded-b-xl">
          {/* Left side - Action buttons */}
          <div className="flex gap-1 items-center">
            <ColorSchemeDialog designScheme={props.designScheme} setDesignScheme={props.setDesignScheme} />
            <McpTools />

            {/* File Upload Button */}
            <IconButton
              title="Upload file"
              className="transition-all duration-200 hover:scale-105"
              onClick={() => props.handleFileUpload()}
            >
              <div className="i-ph:paperclip text-xl"></div>
            </IconButton>

            {/* Enhance Prompt Button */}
            <IconButton
              title="Enhance prompt"
              disabled={props.input.length === 0 || props.enhancingPrompt}
              className={classNames(
                'transition-all duration-200 hover:scale-105',
                props.enhancingPrompt ? 'opacity-100' : 'hover:opacity-80',
              )}
              onClick={() => {
                props.enhancePrompt?.();
                toast.success('Prompt enhanced!');
              }}
            >
              {props.enhancingPrompt ? (
                <div className="i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress text-xl animate-spin"></div>
              ) : (
                <div className="i-bolt:stars text-xl"></div>
              )}
            </IconButton>

            {/* Speech Recognition Button */}
            <SpeechRecognitionButton
              isListening={props.isListening}
              onStart={props.startListening}
              onStop={props.stopListening}
              disabled={props.isStreaming}
            />

            {/* Chat Mode Toggle */}
            {props.chatStarted && (
              <IconButton
                title="Toggle chat mode"
                className={classNames(
                  'transition-all duration-200 flex items-center gap-1.5 px-2 py-1 rounded-md',
                  props.chatMode === 'discuss'
                    ? '!bg-bolt-elements-item-backgroundAccent !text-bolt-elements-item-contentAccent shadow-sm'
                    : 'bg-bolt-elements-item-backgroundDefault text-bolt-elements-item-contentDefault hover:bg-bolt-elements-item-backgroundActive',
                )}
                onClick={() => {
                  props.setChatMode?.(props.chatMode === 'discuss' ? 'build' : 'discuss');
                }}
              >
                <div className="i-ph:chats text-lg" />
                {props.chatMode === 'discuss' ? <span className="text-xs font-medium">Discuss</span> : <></>}
              </IconButton>
            )}

            {/* Model Settings Toggle */}
            <IconButton
              title="Toggle model settings"
              className={classNames('transition-all duration-200 flex items-center gap-1.5 px-2 py-1 rounded-md', {
                'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent shadow-sm':
                  props.isModelSettingsCollapsed,
                'bg-bolt-elements-item-backgroundDefault text-bolt-elements-item-contentDefault hover:bg-bolt-elements-item-backgroundActive':
                  !props.isModelSettingsCollapsed,
              })}
              onClick={() => props.setIsModelSettingsCollapsed(!props.isModelSettingsCollapsed)}
              disabled={!props.providerList || props.providerList.length === 0}
            >
              <div className={`i-ph:caret-${props.isModelSettingsCollapsed ? 'right' : 'down'} text-lg`} />
              {props.isModelSettingsCollapsed ? (
                <span className="text-xs font-medium max-w-20 truncate">{props.model}</span>
              ) : (
                <></>
              )}
            </IconButton>
          </div>

          {/* Right side - Help text and connections */}
          <div className="flex items-center gap-3">
            {props.input.length > 3 && (
              <div className="text-xs text-bolt-elements-textTertiary flex items-center gap-1">
                <span>Use</span>
                <kbd className="px-1.5 py-0.5 rounded-md bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor/60 text-xs font-mono">
                  Shift
                </kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 rounded-md bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor/60 text-xs font-mono">
                  Return
                </kbd>
                <span>for new line</span>
              </div>
            )}
            <SupabaseConnection />
            <ExpoQrModal open={props.qrModalOpen} onClose={() => props.setQrModalOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
};

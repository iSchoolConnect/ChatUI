import React from 'react';
import { Meta } from '@storybook/react/types-6-0';

import Chat, {
  Bubble,
  MessageProps,
  ChatProps,
  useMessages,
  QuickReplyItemProps,
  useQuickReplies,
} from '../../src';
import '../../src/styles/index.less';

export default {
  title: 'Chat',
  component: Chat,
  argTypes: {
    wideBreakpoint: {
      control: {
        type: 'inline-radio',
        options: ['300px', '500px', '600px', ''],
      },
    },
    locale: {
      control: {
        type: 'inline-radio',
        options: ['zh-CN', 'en-US'],
      },
    },
  },
} as Meta;

const initialMessages = [
  {
    type: 'text',
    content: { text: 'Hello master, I am an intelligent assistant' },
    user: { avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg' },
  },
  {
    type: 'image',
    content: {
      picUrl: '//img.alicdn.com/tfs/TB1p_nirYr1gK0jSZR0XXbP8XXa-300-300.png',
    },
  },
];

//Default shortcut phrase, optional
const defaultQuickReplies = [
  {
    icon: 'message',
    name: 'Contact human service',
    code: 'q1',
    isNew: true,
    isHighlight: true,
  },
  {
    name: 'Phrase 1',
    code: 'q2',
    isNew: true,
  },
  {
    name: 'Phrase 2',
    code: 'q3',
    isHighlight: true,
  },
  {
    name: 'Phrase 3',
    code: 'q4',
  },
];

export const Default = (args: ChatProps) => {
  // 消息列表
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);
  const { quickReplies, replace } = useQuickReplies(defaultQuickReplies);

  // 发送回调
  function handleSend(type: string, val: string) {
    if (type === 'text' && val.trim()) {
      // TODO: 发送请求
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });

      setTyping(true);

      // 模拟回复消息
      setTimeout(() => {
        appendMsg({
          type: 'text',
          content: {
            text: 'Dear, what problem are you encountering? Please briefly describe your problem',
          },
        });
      }, 1000);
    }
  }

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item: QuickReplyItemProps) {
    handleSend('text', item.name);

    if (item.code === 'q1') {
      replace([
        {
          name: 'Phrase a',
          code: 'qa',
          isHighlight: true,
        },
        {
          name: 'Phrase b',
          code: 'qb',
        },
      ]);
    }
  }

  function renderMessageContent(msg: MessageProps) {
    const { type, content } = msg;

    // Render based on message type
    switch (type) {
      case 'text':
        return <Bubble content={content.text} />;
      case 'image':
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      default:
        return null;
    }
  }

  return (
    <Chat
      {...args}
      navbar={{ title: 'Intelligent Assistant' }}
      toolbar={[
        {
          type: 'photo',
          title: 'Photo',
          icon: 'image',
        },
      ]}
      messages={messages}
      renderMessageContent={renderMessageContent}
      quickReplies={quickReplies}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
    />
  );
};

Default.args = {
  recorder: {
    canRecord: true,
  },
  rightAction: {
    icon: 'apps',
  },
};

'use client';

import React, {
  createContext,
  FC,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import clsx from 'clsx';
import useCookie from 'react-use-cookie';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useWaitForClass } from '@gitroom/helpers/utils/use.wait.for.class';
import { MultiMediaComponent } from '@gitroom/frontend/components/media/media.component';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useChannels } from '@gitroom/frontend/components/layout/channels.context';

export const MediaPortal: FC<{
  media: { path: string; id: string }[];
  value: string;
  setMedia: (event: {
    target: {
      name: string;
      value?: {
        id: string;
        path: string;
        alt?: string;
        thumbnail?: string;
        thumbnailTimestamp?: number;
      }[];
    };
  }) => void;
}> = ({ media, setMedia, value }) => {
  const waitForClass = useWaitForClass('copilotKitMessages');
  const t = useT();
  if (!waitForClass) return null;
  return (
    <div className="pl-[14px] pr-[24px] whitespace-nowrap editor rm-bg">
      <MultiMediaComponent
        allData={[{ content: value }]}
        text={value}
        label={t('attachments', 'Attachments')}
        description=""
        value={media}
        dummy={false}
        name="image"
        onChange={setMedia}
        onOpen={() => {}}
        onClose={() => {}}
      />
    </div>
  );
};

export const PropertiesContext = createContext({ properties: [] });

const Chevron: FC<{ dir?: 'left' | 'right' }> = ({ dir = 'left' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="7"
    height="13"
    viewBox="0 0 7 13"
    fill="none"
  >
    <path
      d={dir === 'left' ? 'M6 11.5L1 6.5L6 1.5' : 'M1 11.5L6 6.5L1 1.5'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * The agent's channel scope follows the shared header channel dropdown
 * (same control as the calendar): a picked channel targets that channel,
 * "All channels" targets every connected integration.
 */
export const Agent: FC<{ children: ReactNode }> = ({ children }) => {
  const { integrations, selected } = useChannels();
  const t = useT();
  const [collapseMenu, setCollapseMenu] = useCookie('collapseMenu', '0');
  const collapsed = collapseMenu === '1';
  const toggle = useCallback(
    () => setCollapseMenu(collapsed ? '0' : '1'),
    [collapsed]
  );
  const properties = useMemo(
    () => (selected ? [selected] : integrations || []),
    [selected, integrations]
  );

  return (
    <PropertiesContext.Provider value={{ properties }}>
      <Threads collapsed={collapsed} onToggle={toggle} />
      <div className="bg-newBgColorInner flex flex-1 relative">
        {collapsed && (
          <button
            type="button"
            onClick={toggle}
            title={t('open_sidebar', 'Open sidebar')}
            aria-label={t('open_sidebar', 'Open sidebar')}
            className="absolute start-[8px] top-[2px] z-50 text-btnText bg-btnSimple rounded-[6px] w-[24px] h-[24px] flex items-center justify-center cursor-pointer select-none"
          >
            <Chevron dir="right" />
          </button>
        )}
        {children}
      </div>
    </PropertiesContext.Provider>
  );
};

const Threads: FC<{ collapsed: boolean; onToggle: () => void }> = ({
  collapsed,
  onToggle,
}) => {
  const fetch = useFetch();
  const t = useT();
  const threads = useCallback(async () => {
    return (await fetch('/copilot/list')).json();
  }, []);
  const { id } = useParams<{ id: string }>();

  const { data } = useSWR('threads', threads);

  return (
    <div
      className={clsx(
        'trz bg-newBgColorInner flex flex-col gap-[15px] transition-all relative',
        collapsed ? 'w-0 overflow-hidden' : 'w-[260px]'
      )}
    >
      <div className="absolute top-0 start-0 w-full h-full p-[20px] overflow-auto scrollbar scrollbar-thumb-fifth scrollbar-track-newBgColor">
        <div className="flex items-center mb-[15px]">
          <div className="flex-1 text-[14px] font-[500]">
            {t('chats', 'Chats')}
          </div>
          <button
            type="button"
            onClick={onToggle}
            title={t('collapse', 'Collapse')}
            aria-label={t('collapse', 'Collapse')}
            className="text-btnText bg-btnSimple rounded-[6px] w-[24px] h-[24px] flex items-center justify-center cursor-pointer select-none"
          >
            <Chevron dir="left" />
          </button>
        </div>
        <div className="mb-[15px] justify-center flex">
          <Link
            href={`/agents`}
            className="text-white whitespace-nowrap flex-1 py-[8px] ps-[12px] pe-[16px] min-h-[36px] max-h-[36px] rounded-md bg-btnPrimary flex justify-center items-center gap-[5px] outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="16"
              viewBox="0 0 21 20"
              fill="none"
              className="min-w-[17px] min-h-[16px]"
            >
              <path
                d="M10.5001 4.16699V15.8337M4.66675 10.0003H16.3334"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex-1 text-start text-[13px]">
              {t('start_a_new_chat', 'Start a new chat')}
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-[1px]">
          {data?.threads?.map((p: any) => (
            <Link
              className={clsx(
                'overflow-ellipsis overflow-hidden whitespace-nowrap hover:bg-newBgColor px-[10px] py-[6px] rounded-[10px] cursor-pointer',
                p.id === id && 'bg-newBgColor'
              )}
              href={`/agents/${p.id}`}
              key={p.id}
            >
              {p.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

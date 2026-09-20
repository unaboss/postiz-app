'use client';

import { FC, useCallback, useState } from 'react';
import clsx from 'clsx';
import { useClickOutside } from '@mantine/hooks';
import { useChannels } from '@gitroom/frontend/components/layout/channels.context';
import {
  MenuGroupComponent,
} from '@gitroom/frontend/components/launches/channels/channel.list';
import { DNDProvider } from '@gitroom/frontend/components/launches/helpers/dnd.provider';
import ImageWithFallback from '@gitroom/react/helpers/image.with.fallback';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

export const ChannelDropdown: FC = () => {
  const {
    menuIntegrations,
    selected,
    setSelected,
    mutate,
    update,
    continueIntegration,
    refreshChannel,
    changeItemGroup,
    totalNonDisabledChannels,
  } = useChannels();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  const pick = useCallback((integration: any) => {
    setSelected(integration);
    setOpen(false);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        title={t('channels', 'Channels')}
        aria-label={t('channels', 'Channels')}
        className="flex items-center gap-[8px] h-[36px] px-[10px] rounded-[8px] bg-newBgColorInner border border-newTableBorder hover:bg-boxFocused transition-colors cursor-pointer"
      >
        {selected ? (
          <ImageWithFallback
            fallbackSrc={'/no-picture.jpg'}
            src={selected.picture || '/no-picture.jpg'}
            className="rounded-[6px] min-w-[24px] min-h-[24px]"
            alt={selected.identifier}
            width={24}
            height={24}
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M1.66675 10.0417C3.35907 10.2299 4.93698 10.9884 6.14101 12.1924C7.34504 13.3964 8.10353 14.9743 8.29175 16.6667M1.66675 13.4167C2.46749 13.58 3.20253 13.9751 3.7804 14.553C4.35827 15.1309 4.75344 15.8659 4.91675 16.6667M1.66675 16.6667H1.67508M11.6667 17.5H14.3334C15.7335 17.5 16.4336 17.5 16.9684 17.2275C17.4388 16.9878 17.8212 16.6054 18.0609 16.135C18.3334 15.6002 18.3334 14.9001 18.3334 13.5V6.5C18.3334 5.09987 18.3334 4.3998 18.0609 3.86502C17.8212 3.39462 17.4388 3.01217 16.9684 2.77248C16.4336 2.5 15.7335 2.5 14.3334 2.5H5.66675C4.26662 2.5 3.56655 2.5 3.03177 2.77248C2.56137 3.01217 2.17892 3.39462 1.93923 3.86502C1.66675 4.3998 1.66675 5.09987 1.66675 6.5V6.66667"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span className="text-[14px] whitespace-nowrap">
          {selected ? selected.name : t('all_channels', 'All channels')}
        </span>
      </button>
      {open && (
        <div
          className={clsx(
            'absolute end-0 top-[calc(100%+8px)] z-[300] w-[300px] max-h-[70vh] overflow-y-auto scrollbar scrollbar-thumb-fifth scrollbar-track-newBgColor',
            'bg-newBgColorInner border border-newTableBorder rounded-[12px] p-[16px] flex flex-col gap-[16px] shadow-lg'
          )}
        >
          <DNDProvider>
            {menuIntegrations.length === 0 ? (
              <div className="text-[14px] text-textItemBlur">
                {t('no_channels', 'No channels yet')}
              </div>
            ) : (
              menuIntegrations.map((menu) => (
                <MenuGroupComponent
                  collapsed={false}
                  changeItemGroup={changeItemGroup}
                  key={menu.id || menu.name}
                  group={menu}
                  mutate={mutate}
                  continueIntegration={continueIntegration}
                  update={update}
                  refreshChannel={refreshChannel}
                  totalNonDisabledChannels={totalNonDisabledChannels}
                  onSelect={pick}
                />
              ))
            )}
          </DNDProvider>
        </div>
      )}
    </div>
  );
};

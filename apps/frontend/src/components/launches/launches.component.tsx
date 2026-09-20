'use client';

import { useEffect, useState } from 'react';
import { CalendarWeekProvider } from '@gitroom/frontend/components/launches/calendar.context';
import { Filters } from '@gitroom/frontend/components/launches/filters';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';
import { useSearchParams } from 'next/navigation';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useFireEvents } from '@gitroom/helpers/utils/use.fire.events';
import { Calendar } from './calendar';
import { DNDProvider } from '@gitroom/frontend/components/launches/helpers/dnd.provider';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { Onboarding } from '@gitroom/frontend/components/onboarding/onboarding';
import { useChannels } from '@gitroom/frontend/components/layout/channels.context';

export { SVGLine } from '@gitroom/frontend/components/launches/channels/channel.list';

export const LaunchesComponent = () => {
  const search = useSearchParams();
  const toast = useToaster();
  const fireEvents = useFireEvents();
  const t = useT();
  const [reload] = useState(false);
  const { isLoading, sortedIntegrations } = useChannels();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (search.get('msg')) {
      toast.show(search.get('msg')!, 'success');
      window?.opener?.postMessage(
        {
          msg: search.get('msg')!,
          success: false,
        },
        '*'
      );
    }
    if (search.get('added')) {
      fireEvents('channel_added');
      window?.opener?.postMessage(
        {
          msg: t('channel_added', 'Channel added'),
          success: true,
        },
        '*'
      );
    }
    if (window.opener) {
      window.close();
    }
  }, []);

  if (isLoading || reload) {
    return (
      <div className="bg-newBgColorInner p-[20px] flex flex-1 flex-col gap-[15px] transition-all items-center justify-center">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <DNDProvider>
      <Onboarding />
      <CalendarWeekProvider integrations={sortedIntegrations as any}>
        <div className="bg-newBgColorInner flex-1 flex-col flex p-[20px] gap-[12px]">
          <Filters />
          <div className="flex-1 flex">
            <Calendar />
          </div>
        </div>
      </CalendarWeekProvider>
    </DNDProvider>
  );
};

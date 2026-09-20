'use client';

import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { groupBy, orderBy } from 'lodash';
import { useRouter } from 'next/navigation';
import { Integration } from '@prisma/client';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useIntegrationList } from '@gitroom/frontend/components/launches/helpers/use.integration.list';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { CustomVariables } from '@gitroom/frontend/components/launches/add.provider.component';

interface ChannelsContextInterface {
  isLoading: boolean;
  integrations: any[];
  sortedIntegrations: any[];
  menuIntegrations: any[];
  totalNonDisabledChannels: number;
  selected: any;
  setSelected: (integration: any) => void;
  mutate: (data?: any, shouldRevalidate?: boolean) => Promise<any>;
  update: (shouldReload: boolean) => Promise<void>;
  changeItemGroup: (id: string, group: string) => Promise<void>;
  continueIntegration: (integration: any) => () => void;
  refreshChannel: (integration: any) => () => Promise<void>;
}

const ChannelsContext = createContext<ChannelsContextInterface>(null as any);

export const useChannels = () => useContext(ChannelsContext);

export const ChannelsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const fetch = useFetch();
  const router = useRouter();
  const modal = useModals();
  const t = useT();
  const { isLoading, data: integrations, mutate } = useIntegrationList();
  const [selected, setSelected] = useState<any>(null);

  const totalNonDisabledChannels = useMemo(() => {
    return (
      integrations?.filter((integration: any) => !integration.disabled)
        ?.length || 0
    );
  }, [integrations]);

  const changeItemGroup = useCallback(
    async (id: string, group: string) => {
      mutate(
        integrations.map((integration: any) => {
          if (integration.id === id) {
            return {
              ...integration,
              customer: {
                id: group,
              },
            };
          }
          return integration;
        }),
        false
      );
      await fetch(`/integrations/${id}/group`, {
        method: 'PUT',
        body: JSON.stringify({
          group,
        }),
      });
      mutate();
    },
    [integrations]
  );

  const sortedIntegrations = useMemo(() => {
    return orderBy(
      integrations,
      ['type', 'disabled', 'identifier'],
      ['desc', 'asc', 'asc']
    );
  }, [integrations]);

  const menuIntegrations = useMemo(() => {
    return orderBy(
      Object.values(
        groupBy(sortedIntegrations, (o) => o?.customer?.id || '')
      ).map((p) => ({
        name: (p[0].customer?.name || '') as string,
        id: (p[0].customer?.id || '') as string,
        isEmpty: p.length === 0,
        values: orderBy(
          p,
          ['type', 'disabled', 'identifier'],
          ['desc', 'asc', 'asc']
        ),
      })),
      ['isEmpty', 'name'],
      ['desc', 'asc']
    );
  }, [sortedIntegrations]);

  const update = useCallback(async (shouldReload: boolean) => {
    await mutate();
  }, []);

  const continueIntegration = useCallback(
    (integration: any) => async () => {
      router.push(
        `/launches?added=${integration.identifier}&continue=${integration.id}`
      );
    },
    []
  );

  const refreshChannel = useCallback(
    (
        integration: Integration & {
          identifier: string;
          isCustomFields?: boolean;
          customFields?: any[];
        }
      ) =>
      async () => {
        if (integration.isCustomFields) {
          modal.openModal({
            title: t('custom_url', 'Custom URL'),
            withCloseButton: false,
            classNames: {
              modal: 'md',
            },
            children: (
              <CustomVariables
                identifier={integration.identifier}
                gotoUrl={(url: string) => router.push(url)}
                variables={integration.customFields || []}
              />
            ),
          });
          return;
        }

        const { url } = await (
          await fetch(
            `/integrations/social/${integration.identifier}?refresh=${integration.internalId}`,
            {
              method: 'GET',
            }
          )
        ).json();
        window.location.href = url;
      },
    []
  );

  const value = useMemo<ChannelsContextInterface>(
    () => ({
      isLoading,
      integrations: integrations || [],
      sortedIntegrations,
      menuIntegrations,
      totalNonDisabledChannels,
      selected,
      setSelected,
      mutate,
      update,
      changeItemGroup,
      continueIntegration,
      refreshChannel,
    }),
    [
      isLoading,
      integrations,
      sortedIntegrations,
      menuIntegrations,
      totalNonDisabledChannels,
      selected,
      mutate,
      update,
      changeItemGroup,
      continueIntegration,
      refreshChannel,
    ]
  );

  return (
    <ChannelsContext.Provider value={value}>
      {children}
    </ChannelsContext.Provider>
  );
};

import { Store } from '@toeverything/infra';
import { map } from 'rxjs';

import type { GlobalStateService } from '../../storage';
import { AFFINE_HOSTED_ORIGINS, BUILD_IN_SERVERS } from '../constant';
import type { ServerConfig, ServerMetadata } from '../types';

function isBlockedServer(server: ServerMetadata) {
  try {
    return AFFINE_HOSTED_ORIGINS.has(new URL(server.baseUrl).origin);
  } catch {
    return false;
  }
}

export class ServerListStore extends Store {
  constructor(private readonly globalStateService: GlobalStateService) {
    super();
  }

  watchServerList() {
    return this.globalStateService.globalState
      .watch<ServerMetadata[]>('serverList')
      .pipe(
        map(servers => {
          // Air-gapped build: ignore servers persisted by older cloud builds.
          const serverList = [
            ...BUILD_IN_SERVERS,
            ...(servers ?? []).filter(server => !isBlockedServer(server)),
          ];
          return serverList;
        })
      );
  }

  getServerList() {
    return [
      ...BUILD_IN_SERVERS,
      ...(
        this.globalStateService.globalState.get<ServerMetadata[]>(
          'serverList'
        ) ?? []
      ).filter(server => !isBlockedServer(server)),
    ];
  }

  addServer(server: ServerMetadata, serverConfig: ServerConfig) {
    const oldServers =
      this.globalStateService.globalState.get<ServerMetadata[]>('serverList') ??
      [];

    if (oldServers.some(s => s.baseUrl === server.baseUrl)) {
      throw new Error(
        'Server with same base url already exists, ' + server.baseUrl
      );
    }

    this.updateServerConfig(server.id, serverConfig);
    this.globalStateService.globalState.set<ServerMetadata[]>('serverList', [
      ...oldServers,
      server,
    ]);
  }

  removeServer(serverId: string) {
    const oldServers =
      this.globalStateService.globalState.get<ServerMetadata[]>('serverList') ??
      [];

    this.globalStateService.globalState.set<ServerMetadata[]>(
      'serverList',
      oldServers.filter(server => server.id !== serverId)
    );
  }

  watchServerConfig(serverId: string) {
    return this.globalStateService.globalState
      .watch<ServerConfig>(`serverConfig:${serverId}`)
      .pipe(
        map(config => {
          const builtIn = BUILD_IN_SERVERS.find(
            server => server.id === serverId
          );
          if (!builtIn) {
            return config;
          }
          // Ignore a stale cloud config persisted by an older build.
          if (!config || config.type !== builtIn.config.type) {
            return builtIn.config;
          }
          return config;
        })
      );
  }

  getServerConfig(serverId: string) {
    const builtIn = BUILD_IN_SERVERS.find(server => server.id === serverId);
    const config = this.globalStateService.globalState.get<ServerConfig>(
      `serverConfig:${serverId}`
    );
    if (!builtIn) {
      return config;
    }
    if (!config || config.type !== builtIn.config.type) {
      return builtIn.config;
    }
    return config;
  }

  updateServerConfig(serverId: string, config: ServerConfig) {
    this.globalStateService.globalState.set<ServerConfig>(
      `serverConfig:${serverId}`,
      config
    );
  }
}

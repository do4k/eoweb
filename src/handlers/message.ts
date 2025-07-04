import {
  type EoReader,
  MessageOpenServerPacket,
  PacketAction,
  PacketFamily,
} from 'eolib';
import { ChatTab, type Client } from '../client';

function handleMessagePing(client: Client) {
  const delta = Date.now() - client.pingStart;

  client.emit('serverChat', {
    message: `${delta}ms ping`,
  });
}

function handleMessageOpen(client: Client, reader: EoReader) {
  const packet = MessageOpenServerPacket.deserialize(reader);
  // TODO: Status bar message
  client.emit('chat', {
    name: 'System',
    tab: ChatTab.Local,
    message: packet.message,
  });
}

export function registerMessageHandlers(client: Client) {
  client.bus.registerPacketHandler(
    PacketFamily.Message,
    PacketAction.Pong,
    (_) => handleMessagePing(client),
  );
  client.bus.registerPacketHandler(
    PacketFamily.Message,
    PacketAction.Open,
    (reader) => handleMessageOpen(client, reader),
  );
}

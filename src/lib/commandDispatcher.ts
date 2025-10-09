import { parseVoiceCommand } from './voiceControl';

type Actions = {
  createChat: () => void;
  submitText: (text: string) => void;
  speakCurrentSummary: () => void;
  deleteSession: (id?: string) => void;
  selectSession: (id: string) => void;
  getCurrentSessionId?: () => string | null;
}

export function dispatchVoiceText(text: string, actions: Actions) {
  const cmd = parseVoiceCommand(text);
  if (!cmd) return null;

  switch (cmd.intent) {
    case 'new_chat':
      actions.createChat();
      return { handled: true };
    case 'submit_text':
      actions.submitText((cmd.args && cmd.args.join(' ')) || text);
      return { handled: true };
    case 'read':
      actions.speakCurrentSummary();
      return { handled: true };
    case 'delete_chat':
      // try to interpret a numeric arg as index into sessions
      if (cmd.args && cmd.args.length > 0) {
        const n = parseInt(cmd.args[0], 10);
        if (!isNaN(n) && actions.getCurrentSessionId) {
          // if user said "delete chat 2" we don't have mapping to ids, so delete the current
          actions.deleteSession(actions.getCurrentSessionId ? actions.getCurrentSessionId() || undefined : undefined);
        } else {
          actions.deleteSession(cmd.args[0]);
        }
      } else {
        actions.deleteSession(actions.getCurrentSessionId ? actions.getCurrentSessionId() || undefined : undefined);
      }
      return { handled: true };
    case 'start_listening':
    case 'stop_listening':
      // these are local to the voice provider
      return { handled: false };
    default:
      return { handled: false };
  }
}

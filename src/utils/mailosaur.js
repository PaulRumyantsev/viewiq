import MailosaurClient from 'mailosaur';

export async function getLatestEmail(serverId, apiKey, email) {
    const mailosaur = new MailosaurClient(apiKey);

    return await mailosaur.messages.get(
        serverId,
        { sentTo: email },
        { timeout: 60000 }
    );
}

export async function clearInbox(serverId, apiKey) {
    const mailosaur = new MailosaurClient(apiKey);
    await mailosaur.messages.deleteAll(serverId);
}
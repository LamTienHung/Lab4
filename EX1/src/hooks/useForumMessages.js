import { useCallback, useEffect, useState } from 'react';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const messagesUrl = (forum) => `${API_URL}/api/messages/${encodeURIComponent(forum)}`;

async function readError(res) {
  const body = await res.json().catch(() => null);
  const err = new Error(body?.error ?? `HTTP ${res.status}`);
  err.fields = body?.fields;
  return err;
}

export function useForumMessages(forum) {
  const [version, setVersion] = useState(0);
  // Kết quả gắn với đúng (forum, version) đã yêu cầu → loading là derived state
  const [result, setResult] = useState({ forum: null, version: -1, data: [], error: null });

  useEffect(() => {
    const controller = new AbortController();

    const fetchMessages = async () => {
      try {
        const res = await fetch(messagesUrl(forum), { signal: controller.signal });
        if (!res.ok) throw await readError(res);
        const data = await res.json();
        if (!controller.signal.aborted) setResult({ forum, version, data, error: null });
      } catch (err) {
        // Request bị huỷ do đổi kênh/unmount → bỏ qua, không setState, không log
        if (!controller.signal.aborted) setResult({ forum, version, data: [], error: err.message });
      }
    };

    fetchMessages();
    return () => controller.abort();
  }, [forum, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  const postMessage = useCallback(
    async (payload) => {
      const res = await fetch(messagesUrl(forum), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw await readError(res);
      const created = await res.json();
      refetch(); // POST xong → tải lại danh sách
      return created;
    },
    [forum, refetch],
  );

  const sameForum = result.forum === forum;
  const isCurrent = sameForum && result.version === version;

  return {
    data: sameForum ? result.data : [], // không bao giờ hiện tin của kênh cũ
    loading: !isCurrent,
    error: isCurrent ? result.error : null,
    refetch,
    postMessage,
  };
}
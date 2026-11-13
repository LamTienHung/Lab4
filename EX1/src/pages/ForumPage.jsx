import { Fragment } from 'react';
import { Link, NavLink, useParams } from 'react-router';
import { CHANNELS, CHANNEL_BY_ID } from '../forum/channels.js';
import { MessageComposer } from '../forum/MessageComposer.jsx';
import { useForumMessages } from '../hooks/useForumMessages.js';
import styles from '../App.module.css';

const timeFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
const tabClass = ({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink);

function ChannelFeed({ channel }) {
  const { data, loading, error, refetch, postMessage } = useForumMessages(channel.id);

  return (
    <>
      <section aria-labelledby="feed-title" aria-busy={loading} className={styles.feed}>
        <h2 id="feed-title" className={styles.cardTitle}>
          {channel.label} <span className={styles.muted}>· {channel.description}</span>
        </h2>

        <p role="status" aria-live="polite" className={styles.hint}>
          {loading ? 'Đang tải tin nhắn…' : error ? '' : `${data.length} tin nhắn`}
        </p>

        {error && (
          <section role="alert" className={styles.alert}>
            <p>Không tải được tin nhắn: {error}</p>
            <p className={styles.muted}>Kiểm tra server Express đã chạy ở cổng 3001 chưa.</p>
            <button type="button" className={styles.button} onClick={refetch}>
              Thử lại
            </button>
          </section>
        )}

        {data.length > 0 && (
          <dl className={styles.messages}>
            {data.map((msg) => (
              <Fragment key={msg.id}>
                <dt>
                  <strong>{msg.author}</strong>{' '}
                  <time className={styles.muted} dateTime={msg.timestamp}>
                    {timeFormat.format(new Date(msg.timestamp))}
                  </time>
                </dt>
                <dd>{msg.text}</dd>
              </Fragment>
            ))}
          </dl>
        )}
      </section>

      <MessageComposer channelLabel={channel.label} onPost={postMessage} />
    </>
  );
}

export default function ForumPage() {
  const { channel: channelId } = useParams();
  const channel = CHANNEL_BY_ID.get(channelId);

  return (
    <section aria-labelledby="forum-title" className={`${styles.card} ${styles.forumBox}`}>
      <title>{`${channel ? channel.label : 'Không tìm thấy kênh'} · Forum · S3T Directory`}</title>
      <h1 id="forum-title" className={styles.pageTitle}>
        Forum
      </h1>

      <nav aria-label="Chọn kênh">
        <ul className={styles.navList}>
          {CHANNELS.map((c) => (
            <li key={c.id}>
              <NavLink to={`/forum/${c.id}`} className={tabClass}>
                {c.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {channel ? (
        <ChannelFeed channel={channel} />
      ) : (
        <section role="alert" className={styles.alert}>
          <p>
            Không có kênh <code>{channelId}</code>.
          </p>
          <Link to="/forum/nasa" className={styles.button}>
            Về #nasa
          </Link>
        </section>
      )}
    </section>
  );
}
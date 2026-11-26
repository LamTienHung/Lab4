export default function ProfileCard({ profile, offset = { x: 0, y: 0 }, isTop = false, isDragging = false }) {
  // Góc nghiêng theo khoảng kéo ngang (tối đa ±15°)
  const rotate = Math.max(-15, Math.min(15, offset.x / 12));

  // Nhãn gợi ý khi đang kéo
  let hint = null;
  if (offset.y < -60 && Math.abs(offset.x) < 60) hint = 'SUPER';
  else if (offset.x > 50) hint = 'LIKE';
  else if (offset.x < -50) hint = 'NOPE';

  const style = isTop
    ? {
        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotate}deg)`,
        transition: isDragging ? 'none' : undefined,
      }
    : undefined;

  return (
    <article
      className={`profile-card${isTop ? ' is-top' : ' is-next'}`}
      style={style}
      aria-hidden={!isTop}
      aria-labelledby={isTop ? 'profile-name' : undefined}
    >
      <img
        src={profile.photo}
        alt={`Ảnh hồ sơ của ${profile.name}`}
        width={400}
        height={500}
        draggable={false}
        loading={isTop ? 'eager' : 'lazy'}
      />

      {hint && (
        <span className={`swipe-hint hint-${hint.toLowerCase()}`} aria-hidden="true">
          {hint}
        </span>
      )}

      <div className="profile-info">
        <h2 id={isTop ? 'profile-name' : undefined}>
          {profile.name}, <span className="profile-age">{profile.age}</span>
        </h2>
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        {profile.tags?.length > 0 && (
          <ul className="profile-tags" aria-label="Sở thích">
            {profile.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
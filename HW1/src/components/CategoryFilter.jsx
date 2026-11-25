export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <nav aria-label="Lọc theo danh mục">
      <ul className="filter-list">
        {categories.map((c) => {
          const isActive = c.id === active;
          return (
            <li key={c.id}>
              <button
                type="button"
                className={isActive ? 'filter-btn is-active' : 'filter-btn'}
                aria-pressed={isActive}
                onClick={() => {
                  if (!isActive) onChange(c.id);
                }}
              >
                {c.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
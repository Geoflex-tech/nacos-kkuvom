{news.map((n) => (
  <Link to={`/news/${n.slug}`} key={n.id} className="card p-4 block hover:shadow-md">
    <h3 className="font-semibold text-nacos-blue">{n.title}</h3>
    <p className="text-sm text-gray-600 mt-1 line-clamp-3">{n.body}</p>
    <span className="inline-block mt-2 text-xs text-nacos-green font-semibold">
      Read more →
    </span>
  </Link>
))}
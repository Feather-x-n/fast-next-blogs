import styles from './Nav.module.css'

const navItems = [
  { icon: 'icon-shouye', label: '首页' },
  { icon: 'icon-guanyu', label: '关于' },
  { icon: 'icon-16', label: '其他' },
]

export default function Nav() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        {navItems.map((item) => (
          <div key={item.label} className={styles.navItem}>
            <i className={`iconfont ${item.icon}`}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.navRight}>
        <div className={styles.avatar}></div>
      </div>
    </nav>
  )
}

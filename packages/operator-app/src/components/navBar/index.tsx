import { Menu } from '@mui/icons-material'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FunctionComponent, ReactNode, useState } from 'react'
import { theme } from '../../theme/default'


export const NavBar: FunctionComponent<{
  children?: ReactNode
}> = () => {
  const [ mobileOpen, setMobileOpen ] = useState(false)
  const { pathname } = useRouter()
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  const navItems = [
    { label: 'Home', route: '/' },
    { label: 'Statistics', route: '/statistics' },
    {
      label: 'New query',
      route: '/query'
    }
  ]

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ marginTop: theme.spacing(5) }}>
      <List>
        {navItems.map(({ label, route }) => (
          <Link
            href={route}
            key={route}
            passHref
            style={{ textDecoration: 'none' }}
          >
            <ListItem key={route} disablePadding>
              <ListItemButton>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar component="nav" position="sticky">
        <Toolbar
          sx={{
            alignSelf: 'center',
            width: { xs: '100%', xl: `${(5 / 6) * 100}%` }
          }}
        >
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, cursor: 'default' }}
          >
            CMNM OPERATOR
          </Typography>
          <Box
            sx={{ display: { xs: 'none', md: 'block' }, gap: theme.spacing(2) }}
          >
            {navItems.map(({ label, route }) => (
              <Link
                href={route}
                key={route}
                passHref
                style={{ textDecoration: 'none' }}
              >
                <Button
                  key={route}
                  sx={{
                    color: theme.palette.secondary.light,
                    marginRight: theme.spacing(2),
                    border: pathname === route ? '1px solid white' : 'none',
                    borderRadius: theme.spacing(1)
                  }}
                >
                  {label}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '50%' }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  )
}

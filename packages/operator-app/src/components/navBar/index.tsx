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
import { FunctionComponent, ReactNode, useState } from 'react'
import { theme } from '../../theme/default'


export const NavBar: FunctionComponent<{
  children?: ReactNode
}> = () => {
  const [ mobileOpen, setMobileOpen ] = useState(false)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  // TODO - add navigation routes and labels
  const navItems = [ 'Home' ]

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ marginTop: theme.spacing(5) }}>
      <List>
        {navItems.map(item => (
          <ListItem key={item} disablePadding>
            <ListItemButton>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar component="nav" position="sticky">
        <Toolbar sx={{ alignSelf: 'center', width: { xs: '100%', xl: `${5 / 6 * 100}%` } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            CMNM OPERATOR
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map(item => (
              <Button key={item} sx={{ color: theme.palette.secondary.light }}>
                {item}
              </Button>
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
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '50%' }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  )
}

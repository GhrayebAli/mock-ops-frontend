import {
  Box, Card, CardContent, Typography, Grid,
  Chip, Avatar, LinearProgress, Divider,
} from '@mui/material';
import { Group, LocalLaundryService, LocationOn, GroupAdd, PersonRemove } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useUsers } from '../../users/hooks/useUsers';

const AVATAR_COLORS = ['#261B7D', '#05B8AB', '#FE4D4D', '#9c27b0', '#0288d1'];

function MetricCard({
  title, value, icon, color, subtitle, to,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  to?: string;
}) {
  const card = (
    <Card
      sx={{
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        cursor: to ? 'pointer' : 'default',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: color }} />
      <CardContent sx={{ pt: 3, pb: '20px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                fontSize: 11,
              }}
            >
              {title}
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.5, mb: 0.5, fontWeight: 700, lineHeight: 1.2 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${color}18`,
              color,
              borderRadius: 2,
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 26,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        {card}
      </Link>
    );
  }
  return card;
}

export default function Dashboard() {
  const { data: users } = useUsers();

  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter(u => u.isActive).length || 0;
  const inactiveUsers = totalUsers - activeUsers;
  const activePercent = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  const roleGroups = users?.reduce<Record<string, number>>((acc, u) => {
    acc[u.userRole] = (acc[u.userRole] || 0) + 1;
    return acc;
  }, {}) ?? {};

  const recentUsers = users?.slice(0, 5) ?? [];

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Metric cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
          <MetricCard
            title="Total Users"
            value={totalUsers}
            icon={<Group fontSize="inherit" />}
            color="#261B7D"
            subtitle="Registered accounts"
            to="/users"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
          <MetricCard
            title="Active Users"
            value={activeUsers}
            icon={<GroupAdd fontSize="inherit" />}
            color="#05B8AB"
            subtitle={`${activePercent}% of total`}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
          <MetricCard
            title="Inactive Users"
            value={inactiveUsers}
            icon={<PersonRemove fontSize="inherit" />}
            color="#FE4D4D"
            subtitle={`${totalUsers > 0 ? 100 - activePercent : 0}% of total`}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
          <MetricCard
            title="Orders Today"
            value={5}
            icon={<LocalLaundryService fontSize="inherit" />}
            color="#FE4D4D"
            subtitle="Since midnight"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
          <MetricCard
            title="Addresses"
            value={4}
            icon={<LocationOn fontSize="inherit" />}
            color="#261B7D"
            subtitle="Registered locations"
          />
        </Grid>
      </Grid>

      {/* Second row */}
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {/* Recent users */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Users</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {recentUsers.map((user, i) => (
                  <Link key={user.id} to={`/users/${user.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 1,
                        px: 1,
                        mx: -1,
                        borderRadius: 2,
                        transition: 'background-color 0.15s ease',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: AVATAR_COLORS[i % AVATAR_COLORS.length] + '20',
                          color: AVATAR_COLORS[i % AVATAR_COLORS.length],
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {user.firstName[0]}{user.lastName[0]}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {user.email}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 1, flexShrink: 0 }}>
                        {user.userRole}
                      </Typography>
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: 11,
                          height: 22,
                          bgcolor: user.isActive ? 'rgba(5, 184, 171, 0.12)' : 'rgba(0,0,0,0.06)',
                          color: user.isActive ? '#05B8AB' : 'text.secondary',
                          border: '1px solid',
                          borderColor: user.isActive ? 'rgba(5, 184, 171, 0.3)' : 'rgba(0,0,0,0.12)',
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    </Box>
                    {i < recentUsers.length - 1 && <Divider />}
                  </Link>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* User status breakdown */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2.5 }}>User Status</Typography>

              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="body2" color="text.secondary">Active</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{activeUsers}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={activePercent}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="body2" color="text.secondary">Inactive</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{inactiveUsers}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totalUsers > 0 ? (inactiveUsers / totalUsers) * 100 : 0}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': { bgcolor: '#bdbdbd' },
                  }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                By Role
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Object.entries(roleGroups).map(([role, count]) => (
                  <Box
                    key={role}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 1,
                      mx: -1,
                      py: 0.5,
                      borderRadius: 1.5,
                      transition: 'background-color 0.15s ease',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Typography variant="body2">{role}</Typography>
                    <Chip label={count} size="small" sx={{ height: 20, fontSize: 11, minWidth: 28 }} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

import {
  Box, Card, CardContent, Typography, Grid,
  Chip, Avatar, LinearProgress, Divider, Button, TextField, MenuItem, Stack, Paper,
} from '@mui/material';
import { People, LocalLaundryService, LocationOn, CheckCircle, PersonRemove, Download, FilterList, TrendingUp, TrendingDown, ChecklistRtl, Star, ShoppingBag } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useUsers } from '../../users/hooks/useUsers';

const AVATAR_COLORS = ['#1565c0', '#2e7d32', '#ed6c02', '#9c27b0', '#0288d1'];

function MetricCard({
  title, value, icon, color, subtitle, to, trend, trendLabel,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  to?: string;
  trend?: 'up' | 'down';
  trendLabel?: string;
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
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {value}
              </Typography>
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: trend === 'up' ? '#2e7d32' : '#d32f2f' }}>
                  {trend === 'up' ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{trendLabel}</Typography>
                </Box>
              )}
            </Box>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter(u => u.isActive).length || 0;
  const inactiveUsers = totalUsers - activeUsers;
  const activePercent = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  // Calculate onboarding status (mock: 70% have completed profile)
  const onboardingComplete = Math.ceil(totalUsers * 0.7);
  const onboardingPercent = totalUsers > 0 ? Math.round((onboardingComplete / totalUsers) * 100) : 0;

  // Get top agents by user count (mock)
  const agentGroups = users?.reduce<Record<string, number>>((acc, u) => {
    if (u.agentId) {
      acc[u.agentId] = (acc[u.agentId] || 0) + 1;
    }
    return acc;
  }, {}) ?? {};

  const topAgents = Object.entries(agentGroups)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id, count]) => ({ id, count }));

  const roleGroups = users?.reduce<Record<string, number>>((acc, u) => {
    acc[u.userRole] = (acc[u.userRole] || 0) + 1;
    return acc;
  }, {}) ?? {};

  const filteredUsers = users?.filter(u => {
    if (statusFilter === 'active') return u.isActive;
    if (statusFilter === 'inactive') return !u.isActive;
    return true;
  }) ?? [];

  const recentUsers = filteredUsers.slice(0, 5);

  // Mock recent orders data
  const recentOrders = [
    { id: 'ORD-001', customer: 'Sarah Johnson', status: 'completed', amount: '$125.00', date: 'Today' },
    { id: 'ORD-002', customer: 'Omar Hassan', status: 'pending', amount: '$89.50', date: 'Today' },
    { id: 'ORD-003', customer: 'Fatima Al-Mansouri', status: 'in-progress', amount: '$156.75', date: 'Yesterday' },
    { id: 'ORD-004', customer: 'James Wilson', status: 'completed', amount: '$210.00', date: 'Yesterday' },
    { id: 'ORD-005', customer: 'Noor Ahmed', status: 'cancelled', amount: '$95.00', date: '2 days ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: 'rgba(46, 125, 50, 0.12)', text: '#2e7d32' };
      case 'pending': return { bg: 'rgba(237, 108, 2, 0.12)', text: '#ed6c02' };
      case 'in-progress': return { bg: 'rgba(21, 101, 192, 0.12)', text: '#1565c0' };
      case 'cancelled': return { bg: 'rgba(211, 47, 47, 0.12)', text: '#d32f2f' };
      default: return { bg: 'rgba(0,0,0,0.06)', text: 'text.secondary' };
    }
  };

  // Pie chart colors for role segmentation
  const roleColors: Record<string, string> = {
    admin: '#1565c0',
    agent: '#2e7d32',
    customer: '#ed6c02',
    manager: '#9c27b0',
    supervisor: '#0288d1',
  };

  const handleExport = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Status'];
    const rows = filteredUsers.map(u => [
      u.id,
      u.firstName,
      u.lastName,
      u.email,
      u.userRole,
      u.isActive ? 'Active' : 'Inactive',
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">Dashboard</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Overview of your operations
          </Typography>
        </Box>
        <Button startIcon={<Download />} variant="outlined" size="small" onClick={handleExport}>
          Export
        </Button>
      </Box>

      {/* Metric cards */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricCard
            title="Total Users"
            value={totalUsers}
            icon={<People fontSize="inherit" />}
            color="#1565c0"
            subtitle="Registered accounts"
            to="/users"
            trend="up"
            trendLabel="+12%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricCard
            title="Active Users"
            value={activeUsers}
            icon={<CheckCircle fontSize="inherit" />}
            color="#2e7d32"
            subtitle={`${activePercent}% of total`}
            trend="up"
            trendLabel="+8%"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricCard
            title="Inactive Users"
            value={inactiveUsers}
            icon={<PersonRemove fontSize="inherit" />}
            color="#d32f2f"
            subtitle={`${totalUsers > 0 ? 100 - activePercent : 0}% of total`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricCard
            title="Orders Today"
            value={5}
            icon={<LocalLaundryService fontSize="inherit" />}
            color="#ed6c02"
            subtitle="Since midnight"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <MetricCard
            title="Addresses"
            value={4}
            icon={<LocationOn fontSize="inherit" />}
            color="#9c27b0"
            subtitle="Registered locations"
          />
        </Grid>
      </Grid>

      {/* Filter controls */}
      <Stack direction="row" spacing={2} sx={{ my: 3 }}>
        <TextField
          select
          size="small"
          label="Filter by Status"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          sx={{ width: 180 }}
          slotProps={{ input: { startAdornment: <FilterList sx={{ mr: 1, fontSize: 18 }} /> } }}
        >
          <MenuItem value="all">All Users</MenuItem>
          <MenuItem value="active">Active Only</MenuItem>
          <MenuItem value="inactive">Inactive Only</MenuItem>
        </TextField>
        {statusFilter !== 'all' && (
          <Button size="small" onClick={() => setStatusFilter('all')} variant="text">
            Clear Filter
          </Button>
        )}
      </Stack>

      {/* Third row - Onboarding & Agents */}
      <Grid container spacing={2} sx={{ my: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ChecklistRtl sx={{ color: '#1565c0' }} />
                <Typography variant="h6">Onboarding Status</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="body2">Completed</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{onboardingComplete}/{totalUsers}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={onboardingPercent}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(21, 101, 192, 0.1)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#1565c0' },
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {onboardingPercent}% of users have completed profile setup
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 8 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Star sx={{ color: '#ed6c02' }} />
                <Typography variant="h6">Top Performing Agents</Typography>
              </Box>
              {topAgents.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {topAgents.map((agent, i) => (
                    <Box key={agent.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {i + 1}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Agent {agent.id.slice(0, 8)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {agent.count} {agent.count === 1 ? 'user' : 'users'}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={`${agent.count}`}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: AVATAR_COLORS[i % AVATAR_COLORS.length] + '20',
                          color: AVATAR_COLORS[i % AVATAR_COLORS.length],
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No agents assigned yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Fourth row - Recent Orders */}
      <Grid container spacing={2} sx={{ my: 2 }}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <ShoppingBag sx={{ color: '#ed6c02' }} />
                <Typography variant="h6">Recent Orders</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {recentOrders.map((order, i) => {
                  const statusColor = getStatusColor(order.status);
                  return (
                    <Box key={order.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          py: 1.5,
                          px: 1,
                          mx: -1,
                          borderRadius: 2,
                          transition: 'background-color 0.15s ease',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {order.id}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {order.customer}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 2, minWidth: 70 }}>
                          {order.date}
                        </Typography>
                        <Chip
                          label={order.status.replace('-', ' ').toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: 10,
                            height: 20,
                            bgcolor: statusColor.bg,
                            color: statusColor.text,
                            mr: 1.5,
                            minWidth: 90,
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 70, textAlign: 'right' }}>
                          {order.amount}
                        </Typography>
                      </Box>
                      {i < recentOrders.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Fifth row - Users & Status */}
      <Grid container spacing={2} sx={{ mt: 0 }}>
        {/* Recent users with activity timeline */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Users Activity</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {recentUsers.map((user, i) => (
                  <Box key={user.id}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 1.5,
                        px: 1,
                        mx: -1,
                        borderRadius: 2,
                        transition: 'background-color 0.15s ease',
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
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, mr: 1 }}>
                        Joined today
                      </Typography>
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: 11,
                          height: 22,
                          bgcolor: user.isActive ? 'rgba(46, 125, 50, 0.12)' : 'rgba(0,0,0,0.06)',
                          color: user.isActive ? '#2e7d32' : 'text.secondary',
                          border: '1px solid',
                          borderColor: user.isActive ? 'rgba(46, 125, 50, 0.3)' : 'rgba(0,0,0,0.12)',
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    </Box>
                    {i < recentUsers.length - 1 && <Divider />}
                  </Box>
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

      {/* Sixth row - User Segmentation */}
      <Grid container spacing={2} sx={{ my: 2 }}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>User Segmentation by Role</Typography>
              <Grid container spacing={3}>
                {/* Pie Chart Visualization */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 250 }}>
                    <Box sx={{ position: 'relative', width: 200, height: 200 }}>
                      <svg width="200" height="200" viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
                        {(() => {
                          let currentAngle = 0;
                          const roles = Object.entries(roleGroups);
                          const total = roles.reduce((sum, [, count]) => sum + count, 0);

                          return roles.map(([role, count], i) => {
                            const slicePercent = count / total;
                            const sliceAngle = slicePercent * 360;
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + sliceAngle;

                            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

                            const largeArc = sliceAngle > 180 ? 1 : 0;
                            const pathData = [
                              `M 100 100`,
                              `L ${x1} ${y1}`,
                              `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
                              'Z',
                            ].join(' ');

                            const result = (
                              <path
                                key={role}
                                d={pathData}
                                fill={roleColors[role] || AVATAR_COLORS[i % AVATAR_COLORS.length]}
                                stroke="white"
                                strokeWidth="2"
                              />
                            );

                            currentAngle = endAngle;
                            return result;
                          });
                        })()}
                      </svg>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {totalUsers}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Users
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                {/* Legend and Breakdown */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {Object.entries(roleGroups).map(([role, count], i) => {
                      const percent = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                      const color = roleColors[role] || AVATAR_COLORS[i % AVATAR_COLORS.length];

                      return (
                        <Paper key={role} sx={{ p: 1.5, border: `2px solid ${color}20`, borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: color,
                                }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                {role}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={count}
                                size="small"
                                sx={{
                                  fontWeight: 700,
                                  height: 24,
                                  bgcolor: `${color}20`,
                                  color,
                                }}
                              />
                              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 35 }}>
                                {percent}%
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

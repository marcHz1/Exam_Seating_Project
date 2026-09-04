const enrollmentRoutes = require('../src/routes/enrollmentRoutes');

describe('enrollment routes', () => {
  test('registers a student my-enrollments endpoint', () => {
    const routes = enrollmentRoutes.stack
      .filter(layer => layer.route)
      .map(layer => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));

    expect(routes).toContainEqual(
      expect.objectContaining({
        path: '/my-enrollments',
        methods: expect.arrayContaining(['get']),
      })
    );
  });
});

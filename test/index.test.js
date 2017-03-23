jest.mock('require-relative');
const relative = require('require-relative');
const plugin = require('../src/index');

const pMock = jest.fn((pC, c, cb) => {
  if (pMock.unexpectedError) {
    throw pMock.unexpectedError;
  }
  if (pMock.expectedError) {
    cb(pMock.expectedError);
  }
  else {
    cb(null, pC);
  }
});
relative.mockImplementation(() => pMock);

test('Multiple plugins are invoked', (done) => {
  expect.assertions(2);
  const config = {
    plugins: [
      'a-simple-plugin',
      {
        path: 'a-more-complicated-plugin',
        someProperty: 'I should be passed to this plugin!',
      },
    ],
  };
  plugin(config, {}, (err, res) => {
    expect(err).toBeNull();
    expect(res).toEqual(config.plugins);
    done();
  });
});

test('Plugin errors are reported', (done) => {
  expect.assertions(2);
  pMock.expectedError = new Error('I should be thrown');
  const config = {
    plugins: [
      'i-should-throw-an-error',
    ],
  };
  plugin(config, {}, (err, res) => {
    expect(err).toEqual([pMock.expectedError]);
    expect(res).toBeNull();
    delete pMock.expectedError;
    done();
  });
});

test('Uncaught plugin errors are reported', (done) => {
  expect.assertions(2);
  pMock.unexpectedError = new Error('I did something bad');
  plugin({ plugins: ['a-bad-plugin'] }, {}, (err, res) => {
    expect(err).toEqual(pMock.unexpectedError);
    expect(res).toBeUndefined();
    delete pMock.unexpectedError;
    done();
  });
});

test('Error is reported when no plugin config exists', (done) => {
  expect.assertions(2);
  plugin({}, {}, (err, res) => {
    expect(err).toEqual(new Error('No generateNotes plugins defined.'));
    expect(res).toBeUndefined();
    done();
  });
});

test('Error is reported when no plugins were defined', (done) => {
  expect.assertions(2);
  plugin({ plugins: [] }, {}, (err, res) => {
    expect(err).toEqual(new Error('No generateNotes plugins defined.'));
    expect(res).toBeUndefined();
    done();
  });
});

test('Errors are reported for improperly defined plugins', (done) => {
  expect.assertions(2);
  plugin({ plugins: [{ noPath: 'I do not have a path' }] }, {}, (err, res) => {
    expect(err).toEqual([new Error('Improperly defined plugin.')]);
    expect(res).toBeNull();
    done();
  });
});

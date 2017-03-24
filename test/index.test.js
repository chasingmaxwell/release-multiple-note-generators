jest.mock('require-relative');
const relative = require('require-relative');
const _ = require('lodash');
const plugin = require('../src/index');

const pMock = jest.fn((pC, c, cb) => {
  if (pMock.unexpectedError) {
    throw pMock.unexpectedError;
  }
  if (pMock.expectedError) {
    cb(pMock.expectedError);
  }

  const log = pC.incompleteLog || 'This is a log.';

  cb(null, [log, 'with an addition.'].join(' '));
});

relative.mockImplementation(() => pMock);

test('Multiple plugins are invoked and each can alter the log', (done) => {
  expect.assertions(7);
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
    expect(res).toEqual('This is a log. with an addition. with an addition.');
    expect(pMock).toHaveBeenCalledTimes(2);
    expect(pMock.mock.calls[0][0]).toEqual({ incompleteLog: '' });
    expect(pMock.mock.calls[0][1]).toEqual({});
    expect(pMock.mock.calls[1][0]).toEqual(_.assign({ incompleteLog: 'This is a log. with an addition.' }, config.plugins[1]));
    expect(pMock.mock.calls[1][1]).toEqual({});
    done();
  });
});

test('Plugin errors are reported', (done) => {
  expect.assertions(2);
  pMock.expectedError = new Error('I should be reported');
  const config = {
    plugins: [
      'i-should-throw-an-error',
    ],
  };
  plugin(config, {}, (err, res) => {
    expect(err).toEqual(pMock.expectedError);
    expect(res).toBeUndefined();
    delete pMock.expectedError;
    done();
  });
});

test('Uncaught plugin errors are reported', (done) => {
  expect.assertions(2);
  pMock.unexpectedError = new Error('I should be thrown');
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
    expect(err).toEqual(new Error('Improperly defined plugin.'));
    expect(res).toBeUndefined();
    done();
  });
});

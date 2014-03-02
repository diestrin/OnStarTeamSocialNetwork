'use strict';

describe('Service: Memoryadapter', function () {

  // load the service's module
  beforeEach(module('OST-API'));

  // instantiate service
  var MemoryAdapter;
  beforeEach(inject(function (_MemoryAdapter_) {
    MemoryAdapter = _MemoryAdapter_;
  }));

  it('should store and recover a string', function () {
    var key, value;

    key = 'Test:String';
    value = 'Casa casita';

    MemoryAdapter.set(key, value);
    expect(MemoryAdapter.get(key)).toBe(value);
  });

  it('should store and recover an integer', function () {
    var key, value;

    key = 'Test:Integer';
    value = 500;

    MemoryAdapter.set(key, value);
    expect(MemoryAdapter.get(key)).toBe(value);
  });

  it('should store and recover an array', function () {
    var key, value;

    key = 'Test:Array';
    value = [1,2,3,4];

    MemoryAdapter.set(key, value);
    expect(MemoryAdapter.get(key)).toEqual(value);
  });

  it('should store and recover an object', function () {
    var key, value;

    key = 'Test:Object';
    value = {casa: 'casita'};

    MemoryAdapter.set(key, value);
    expect(MemoryAdapter.get(key)).toEqual(value);
  });

  it('should store and recover a RegExp object', function () {
    var key, value;

    key = 'Test:Object';
    value = /casa/i;

    MemoryAdapter.set(key, value);
    expect(MemoryAdapter.get(key)).toEqual(value);
  });

  it('should delete one registry', function () {
    var key, value;

    key = 'Test:Delete';
    value = 'to delete';

    MemoryAdapter.set(key, value);
    MemoryAdapter.remove(key);
    expect(MemoryAdapter.get(key)).toBeNull();
  });

  it('should delete one registry', function () {
    var key, value;

    key = 'Test:Reset';
    value = 'to reset';

    MemoryAdapter.set(key, value);
    MemoryAdapter.reset();
    expect(MemoryAdapter.get(key)).toBeNull();
  });
});

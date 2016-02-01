function w3g_clone(object) {
  function OneShotConstructor() {}
  OneShotConstructor.prototype = object;
  return new OneShotConstructor();
}

function w3g_inherits(instance, baseConstructor) {
  instance.prototype = w3g_clone(baseConstructor.prototype);
  instance.prototype.constructor = instance;
}

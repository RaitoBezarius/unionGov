let
  pkgs = import <nixpkgs> {};
  lib = pkgs.lib;
  users = lib.filter (v: v != "") (lib.splitString "\n" (builtins.readFile ../root.keys));
  systems = [ "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILQdaBVQggspxypx4v2c1Fpdn3T92/oMy+rEKNzj37L0 uniongov@dc1" ];
in
  {
    "backendEnv.age".publicKeys = users ++ systems;
  }
